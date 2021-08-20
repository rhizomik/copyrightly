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
    reserve ratio, represented in ppm, 1-1000000
    1/3 corresponds to y= multiple * x^2
    1/2 corresponds to y= multiple * x
    2/3 corresponds to y= multiple * x^1/2
    multiple will depends on contract initialization,
    specifically totalAmount and poolBalance parameters
    we might want to add an 'initialize' function that will allow
    the owner to send ether to the contract and mint a given amount of tokens
  */
  uint32 public reserveRatio;
  uint32 public initialSlope;

  /*
    Front-running attacks are currently mitigated by defining a maximum
    gas price limit which tries to prevent users from having control over the order of execution
  */
  uint256 public gasPrice; // maximum gas price for Bancor transactions

  struct Stake {
    uint256 staked;
    mapping(address => uint256) individualStakes;
  }

  mapping(string => Stake) public stakes;

  event Minted(address buyer, uint256 amount, uint256 payed, address stakable, string manifestation);
  event Burned(address seller, uint256 amount, uint256 earned, address stakable, string manifestation);
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

  function mint(uint256 amount, uint256 maxPrice, address stakable, string memory manifestation) public payable
  validGasPrice() whenNotPaused() returns (uint256) {
    require(maxPrice != 0 && msg.value == maxPrice, "Incorrect Ether value sent");
    require(amount > 0, "Must specify a non-zero amount of CLY");
    Stakable(stakable).isStakable(manifestation);

    uint256 price = amount.mul(initialSlope); // Use default curve slope when poolBalance = 0
    if (poolBalance > 0) {
      price = purchaseTargetAmount(totalSupply(), poolBalance, reserveRatio, amount);
    }

    emit CurvePurchase(totalSupply(), poolBalance, amount, price);

    require(price <= maxPrice, "Current price exceeds maximum provided");

    uint256 refund = maxPrice.sub(price);
    if (refund > 0) {
      payable(msg.sender).transfer(refund);
    }

    poolBalance = poolBalance.add(price);
    _mint(msg.sender, amount);

    stakes[manifestation].individualStakes[msg.sender] += amount;
    stakes[manifestation].staked += amount;

    emit Minted(msg.sender, amount, price, stakable, manifestation);

    return price;
  }

  function burn(uint256 amount, address stakable, string memory manifestation) public
  validGasPrice() validBurn(stakable, manifestation, amount) whenNotPaused() returns (uint256) {
    require(amount > 0, "Must specify a non-zero amount of CLY");

    uint256 price = saleTargetAmount(totalSupply(), poolBalance, reserveRatio, amount);

    emit CurveSale(totalSupply(), poolBalance, amount, price);

    payable(msg.sender).transfer(price);

    poolBalance = poolBalance.sub(price);
    _burn(msg.sender, amount);
    stakes[manifestation].individualStakes[msg.sender] -= amount;
    stakes[manifestation].staked -= amount;

    emit Burned(msg.sender, amount, price, stakable, manifestation);

    return price;
  }

  function getIndividualStake(string memory manifestation, address staker) public view returns (uint256) {
    return stakes[manifestation].individualStakes[staker];
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

  modifier validBurn(address stakable, string memory manifestation, uint256 amount) {
    Stakable(stakable).isStakable(manifestation);
    require(stakes[manifestation].individualStakes[msg.sender] >= amount, "Holder hasn't enough CLY to unstake");
    _;
  }
}
