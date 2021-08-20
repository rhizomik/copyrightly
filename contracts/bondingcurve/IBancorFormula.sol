// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.6;

/*
    Bancor Formula interface
*/
interface IBancorFormula {
  function purchaseTargetAmount(
    uint256 _supply,
    uint256 _reserveBalance,
    uint32 _reserveWeight,
    uint256 _amount
  ) external view returns (uint256);

  function saleTargetAmount(
    uint256 _supply,
    uint256 _reserveBalance,
    uint32 _reserveWeight,
    uint256 _amount
  ) external view returns (uint256);
}
