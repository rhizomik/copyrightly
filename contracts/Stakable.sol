// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";


/// @title Library to implement items that can accumulate stake
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Stakable is Ownable {
    using SafeMath for uint8;

    /// @notice Checks if the manifestation with `hash` can have stake.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    function isStakable(string memory hash) virtual public { }
}
