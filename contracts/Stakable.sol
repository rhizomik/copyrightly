// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/// @title Library to implement items that can accumulate stake
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Stakable is Ownable {
  using SafeMath for uint256;

  address authorisedToken;
  mapping(string => uint256) public staked;

  /// @dev Modifier controlling that only the registered token can add stake
  modifier onlyAllowedToken() {
    require(authorisedToken == msg.sender, "Only registered token can add stake");
    _;
  }

  /// @notice Sets the `token` address authorised to add and remove stake.
  /// @param token The address of the authorised token contract
  function setToken(address token) public onlyOwner {
    authorisedToken = token;
  }

  /// @notice Checks if the item with `hash` can have stake, depending on implementation.
  /// For instance, the item is already registered.
  /// @param hash Hash identifying the item, for instance IPFS Base58 Hash
  function isStakable(string memory hash) virtual public {}

  /// @notice Check if the stakable `hash` has some stake.
  /// @dev Used to check if the corresponding item has a current stake bigger than 0.
  /// @param hash Hash identifying the item to get stake, for instance IPFS Base58 Hash
  function isStaked(string memory hash) public view returns(bool) {
    return (staked[hash] > 0);
  }

  /// @notice Adds `amount` stake on the registered token to the item with `hash`.
  /// @param amount Amount of stake on the registered token to add
  /// @param hash Hash identifying the item to get stake, for instance IPFS Base58 Hash
  function addStake(uint256 amount, string memory hash) public onlyAllowedToken {
    staked[hash] += amount;
  }

  /// @notice Removes `amount` of stake on the registered token from the item with `hash`.
  /// @param amount Amount of stake on the registered token to remove
  /// @param hash Hash identifying the item to loose stake, for instance IPFS Base58 Hash
  function removeStake(uint256 amount, string memory hash) public onlyAllowedToken {
    require(amount <= staked[hash], 'No more than the amount currently staked can be removed');
    staked[hash] -= amount;
  }
}
