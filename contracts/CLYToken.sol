// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/Pausable.sol";
import "./bondingcurve/BancorFormula.sol";
import "./Stakable.sol";

/**
 * @title CopyrightLY Token (CLY)
 * @dev Token with bonding curve contract based on Bancor formula
 * inspired by Commons Stack:
 * https://github.com/commons-stack/genesis-contracts/tree/master/contracts/bondingcurve
 */
contract CLYToken is ERC20, BancorFormula, Pausable, Ownable {
  using SafeMath for uint256;

  // Helper to represent fractions => 100% = 1000000, 1% = 10000
  uint256 constant DENOMINATOR_PPM = 1000000;
  uint256 public poolBalance;

  /*
    CLYToken price follows a curve y = m * x^n - c
    m and c correspond to CLY totalSupply and x = 1 + amount/poolBalance
    n = reserveRatio, where the reserveRatio is represented in ppm, 1-1000000
    100000 means 1/10 and corresponds to curve y = m * x^1/10 - c
    500000 means 1/2 and corresponds to curve y = m * x^1/2 - c
    900000 means 9/10 and corresponds to curve y = m * x^9/10 - c
    CLY price = totalSupply * (1 + amount/poolBalance)^(reserveRatio/DENOMINATOR_PPM) - totalSupply
  */
  uint32 public reserveRatio;
  uint32 public initialSlope;

  /*
    Front-running attacks are currently mitigated by defining a maximum
    gas price limit which tries to prevent users from having control over the order of execution
  */
  uint256 public gasPrice; // maximum gas price for Bancor transactions

  mapping(string => mapping(address => uint256)) public individualStakes;

  event Minted(address buyer, uint256 amount, uint256 payed, address stakable, string item);
  event Burned(address seller, uint256 amount, uint256 earned, address stakable, string item);
  event CurvePurchase(uint256 supply, uint256 balance, uint256 amount, uint256 price);
  event CurveSale(uint256 supply, uint256 balance, uint256 amount, uint256 price);

  constructor(uint32 _reserveRatio, uint32 _initialSlope, uint256 _gasPrice) mustBeInPPM(_reserveRatio)
  ERC20("CopyrightLY Token", "CLY") payable {
    reserveRatio = _reserveRatio;
    initialSlope = _initialSlope;
    gasPrice = _gasPrice;
  }

  function decimals() public view virtual override returns (uint8) {
    return 16;
  }

  function getMintPrice(uint256 amount) public view
  returns (uint256) {
    require(amount > 0, "Must specify a non-zero amount of CLY");

    uint256 price = amount.mul(initialSlope); // Use default curve slope when poolBalance = 0
    if (poolBalance > 0) {
      price = purchaseTargetAmount(totalSupply(), poolBalance, reserveRatio, amount);
    }
    return price;
  }

  function mint(uint256 amount, uint256 maxPrice, address stakable, string memory item) public payable
  validGasPrice() whenNotPaused() returns (uint256) {
    require(maxPrice != 0 && msg.value == maxPrice, "Incorrect Ether value sent");
    Stakable(stakable).isStakable(item);

    uint256 price = getMintPrice(amount);

    require(price <= maxPrice, "Current price exceeds maximum provided");

    emit CurvePurchase(totalSupply(), poolBalance, amount, price);

    uint256 refund = maxPrice.sub(price);
    if (refund > 0) {
      payable(msg.sender).transfer(refund);
    }

    poolBalance = poolBalance.add(price);
    _mint(msg.sender, amount);

    individualStakes[item][msg.sender] += amount;
    Stakable(stakable).addStake(amount, item);

    emit Minted(msg.sender, amount, price, stakable, item);

    return price;
  }

  function getBurnPrice(uint256 amount) public view
  returns (uint256) {
    require(amount > 0, "Must specify a non-zero amount of CLY");

    return saleTargetAmount(totalSupply(), poolBalance, reserveRatio, amount);
  }

  function burn(uint256 amount, address stakable, string memory item) public
  validGasPrice() whenNotPaused() validBurn(stakable, item, amount) returns (uint256) {

    uint256 price = getBurnPrice(amount);

    emit CurveSale(totalSupply(), poolBalance, amount, price);

    payable(msg.sender).transfer(price);

    poolBalance = poolBalance.sub(price);
    _burn(msg.sender, amount);
    individualStakes[item][msg.sender] -= amount;
    Stakable(stakable).removeStake(amount, item);

    emit Burned(msg.sender, amount, price, stakable, item);

    return price;
  }

  function transfer(address, uint256) public pure override returns (bool) {
    require(false, "CLY Token is not transferable");
    return false;
  }

  function transferFrom(address, address, uint256) public pure override returns (bool) {
    require(false, "CLY Token is not transferable");
    return false;
  }

  function getIndividualStake(string memory item, address staker) public view returns (uint256) {
    return individualStakes[item][staker];
  }

  function setGasPrice(uint256 _gasPrice) public onlyOwner {
    require(_gasPrice > 0, "Maximum gas price should be bigger than 0");
    gasPrice = _gasPrice;
  }

  function setReserveRatio(uint32 _reserveRatio) public onlyOwner mustBeInPPM(_reserveRatio) {
    reserveRatio = _reserveRatio;
  }

  function pause() public onlyOwner {
    super._pause();
  }

  function unpause() public onlyOwner {
    super._unpause();
  }

  modifier mustBeInPPM(uint256 _val) {
    require(_val <= DENOMINATOR_PPM, "Value must be in PPM");
    _;
  }

  modifier validGasPrice() {
    assert(tx.gasprice <= gasPrice);
    _;
  }

  modifier validBurn(address stakable, string memory item, uint256 amount) {
    Stakable(stakable).isStakable(item);
    require(individualStakes[item][msg.sender] >= amount, "Holder hasn't enough CLY to unstake");
    _;
  }
}
