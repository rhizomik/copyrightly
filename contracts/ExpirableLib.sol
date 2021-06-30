// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.6;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";


/// @title Library to implement expirable items
/// @author Roberto García (http://rhizomik.net/~roberto/)
library ExpirableLib {
    using SafeMath for uint;

    struct TimeAndExpiry {
        uint256 creationTime;
        uint256 expiryTime;
    }

    /// @notice Check if `self` TimeAndExpiry struct expiry time has arrived.
    /// @dev This method checks if there is a expiry time and if it is expired.
    /// @param self TimeAndExpiry struct
    function isExpired(TimeAndExpiry storage self) internal view returns(bool) {
        return (self.expiryTime > 0 && self.expiryTime < block.timestamp); // solhint-disable-line not-rely-on-time
    }

    /// @notice Set expiry time for `self` TimeAndExpiry struct to now plus `duration`.
    /// @dev Call this method to set the creationTime and expiryTime in the TimeAndExpiry struct.
    /// @param self TimeAndExpiry struct
    /// @param duration Time from current time till expiry
    function setExpiry(TimeAndExpiry storage self, uint256 duration) internal {
        self.creationTime = block.timestamp;                              // solhint-disable-line not-rely-on-time
        self.expiryTime = block.timestamp.add(duration);                  // solhint-disable-line not-rely-on-time
    }
}
