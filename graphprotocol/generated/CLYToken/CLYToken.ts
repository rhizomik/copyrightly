// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get spender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Burned extends ethereum.Event {
  get params(): Burned__Params {
    return new Burned__Params(this);
  }
}

export class Burned__Params {
  _event: Burned;

  constructor(event: Burned) {
    this._event = event;
  }

  get seller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get earned(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get stakable(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get item(): string {
    return this._event.parameters[4].value.toString();
  }
}

export class CurvePurchase extends ethereum.Event {
  get params(): CurvePurchase__Params {
    return new CurvePurchase__Params(this);
  }
}

export class CurvePurchase__Params {
  _event: CurvePurchase;

  constructor(event: CurvePurchase) {
    this._event = event;
  }

  get supply(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get balance(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class CurveSale extends ethereum.Event {
  get params(): CurveSale__Params {
    return new CurveSale__Params(this);
  }
}

export class CurveSale__Params {
  _event: CurveSale;

  constructor(event: CurveSale) {
    this._event = event;
  }

  get supply(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get balance(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get price(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Minted extends ethereum.Event {
  get params(): Minted__Params {
    return new Minted__Params(this);
  }
}

export class Minted__Params {
  _event: Minted;

  constructor(event: Minted) {
    this._event = event;
  }

  get buyer(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get payed(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get stakable(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get item(): string {
    return this._event.parameters[4].value.toString();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class CLYToken extends ethereum.SmartContract {
  static bind(address: Address): CLYToken {
    return new CLYToken("CLYToken", address);
  }

  allowance(owner: Address, spender: Address): BigInt {
    let result = super.call(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );

    return result[0].toBigInt();
  }

  try_allowance(owner: Address, spender: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  approve(spender: Address, amount: BigInt): boolean {
    let result = super.call("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_approve(spender: Address, amount: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  balanceOf(account: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  decreaseAllowance(spender: Address, subtractedValue: BigInt): boolean {
    let result = super.call(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_decreaseAllowance(
    spender: Address,
    subtractedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  gasPrice(): BigInt {
    let result = super.call("gasPrice", "gasPrice():(uint256)", []);

    return result[0].toBigInt();
  }

  try_gasPrice(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("gasPrice", "gasPrice():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  increaseAllowance(spender: Address, addedValue: BigInt): boolean {
    let result = super.call(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_increaseAllowance(
    spender: Address,
    addedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  individualStakes(param0: string, param1: Address): BigInt {
    let result = super.call(
      "individualStakes",
      "individualStakes(string,address):(uint256)",
      [ethereum.Value.fromString(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBigInt();
  }

  try_individualStakes(
    param0: string,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "individualStakes",
      "individualStakes(string,address):(uint256)",
      [ethereum.Value.fromString(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  initialSlope(): BigInt {
    let result = super.call("initialSlope", "initialSlope():(uint32)", []);

    return result[0].toBigInt();
  }

  try_initialSlope(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("initialSlope", "initialSlope():(uint32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  poolBalance(): BigInt {
    let result = super.call("poolBalance", "poolBalance():(uint256)", []);

    return result[0].toBigInt();
  }

  try_poolBalance(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("poolBalance", "poolBalance():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  purchaseTargetAmount(
    _supply: BigInt,
    _reserveBalance: BigInt,
    _reserveWeight: BigInt,
    _amount: BigInt
  ): BigInt {
    let result = super.call(
      "purchaseTargetAmount",
      "purchaseTargetAmount(uint256,uint256,uint32,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_supply),
        ethereum.Value.fromUnsignedBigInt(_reserveBalance),
        ethereum.Value.fromUnsignedBigInt(_reserveWeight),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );

    return result[0].toBigInt();
  }

  try_purchaseTargetAmount(
    _supply: BigInt,
    _reserveBalance: BigInt,
    _reserveWeight: BigInt,
    _amount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "purchaseTargetAmount",
      "purchaseTargetAmount(uint256,uint256,uint32,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_supply),
        ethereum.Value.fromUnsignedBigInt(_reserveBalance),
        ethereum.Value.fromUnsignedBigInt(_reserveWeight),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  reserveRatio(): BigInt {
    let result = super.call("reserveRatio", "reserveRatio():(uint32)", []);

    return result[0].toBigInt();
  }

  try_reserveRatio(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("reserveRatio", "reserveRatio():(uint32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  saleTargetAmount(
    _supply: BigInt,
    _reserveBalance: BigInt,
    _reserveWeight: BigInt,
    _amount: BigInt
  ): BigInt {
    let result = super.call(
      "saleTargetAmount",
      "saleTargetAmount(uint256,uint256,uint32,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_supply),
        ethereum.Value.fromUnsignedBigInt(_reserveBalance),
        ethereum.Value.fromUnsignedBigInt(_reserveWeight),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );

    return result[0].toBigInt();
  }

  try_saleTargetAmount(
    _supply: BigInt,
    _reserveBalance: BigInt,
    _reserveWeight: BigInt,
    _amount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "saleTargetAmount",
      "saleTargetAmount(uint256,uint256,uint32,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_supply),
        ethereum.Value.fromUnsignedBigInt(_reserveBalance),
        ethereum.Value.fromUnsignedBigInt(_reserveWeight),
        ethereum.Value.fromUnsignedBigInt(_amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  totalSupply(): BigInt {
    let result = super.call("totalSupply", "totalSupply():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalSupply", "totalSupply():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  getMintPrice(amount: BigInt): BigInt {
    let result = super.call("getMintPrice", "getMintPrice(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBigInt();
  }

  try_getMintPrice(amount: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getMintPrice",
      "getMintPrice(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(amount)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getBurnPrice(amount: BigInt): BigInt {
    let result = super.call("getBurnPrice", "getBurnPrice(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBigInt();
  }

  try_getBurnPrice(amount: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getBurnPrice",
      "getBurnPrice(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(amount)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  burn(amount: BigInt, stakable: Address, item: string): BigInt {
    let result = super.call("burn", "burn(uint256,address,string):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(amount),
      ethereum.Value.fromAddress(stakable),
      ethereum.Value.fromString(item)
    ]);

    return result[0].toBigInt();
  }

  try_burn(
    amount: BigInt,
    stakable: Address,
    item: string
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "burn",
      "burn(uint256,address,string):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(stakable),
        ethereum.Value.fromString(item)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  transfer(param0: Address, param1: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(param0),
      ethereum.Value.fromUnsignedBigInt(param1)
    ]);

    return result[0].toBoolean();
  }

  try_transfer(param0: Address, param1: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(param0),
      ethereum.Value.fromUnsignedBigInt(param1)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(param0: Address, param1: Address, param2: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    param0: Address,
    param1: Address,
    param2: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getIndividualStake(item: string, staker: Address): BigInt {
    let result = super.call(
      "getIndividualStake",
      "getIndividualStake(string,address):(uint256)",
      [ethereum.Value.fromString(item), ethereum.Value.fromAddress(staker)]
    );

    return result[0].toBigInt();
  }

  try_getIndividualStake(
    item: string,
    staker: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getIndividualStake",
      "getIndividualStake(string,address):(uint256)",
      [ethereum.Value.fromString(item), ethereum.Value.fromAddress(staker)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _reserveRatio(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _initialSlope(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _gasPrice(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class DecreaseAllowanceCall extends ethereum.Call {
  get inputs(): DecreaseAllowanceCall__Inputs {
    return new DecreaseAllowanceCall__Inputs(this);
  }

  get outputs(): DecreaseAllowanceCall__Outputs {
    return new DecreaseAllowanceCall__Outputs(this);
  }
}

export class DecreaseAllowanceCall__Inputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get subtractedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DecreaseAllowanceCall__Outputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class IncreaseAllowanceCall extends ethereum.Call {
  get inputs(): IncreaseAllowanceCall__Inputs {
    return new IncreaseAllowanceCall__Inputs(this);
  }

  get outputs(): IncreaseAllowanceCall__Outputs {
    return new IncreaseAllowanceCall__Outputs(this);
  }
}

export class IncreaseAllowanceCall__Inputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get addedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncreaseAllowanceCall__Outputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class InitCall extends ethereum.Call {
  get inputs(): InitCall__Inputs {
    return new InitCall__Inputs(this);
  }

  get outputs(): InitCall__Outputs {
    return new InitCall__Outputs(this);
  }
}

export class InitCall__Inputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class InitCall__Outputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class MintCall extends ethereum.Call {
  get inputs(): MintCall__Inputs {
    return new MintCall__Inputs(this);
  }

  get outputs(): MintCall__Outputs {
    return new MintCall__Outputs(this);
  }
}

export class MintCall__Inputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get maxPrice(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get stakable(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get item(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class MintCall__Outputs {
  _call: MintCall;

  constructor(call: MintCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class BurnCall extends ethereum.Call {
  get inputs(): BurnCall__Inputs {
    return new BurnCall__Inputs(this);
  }

  get outputs(): BurnCall__Outputs {
    return new BurnCall__Outputs(this);
  }
}

export class BurnCall__Inputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get stakable(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get item(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class BurnCall__Outputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class SetGasPriceCall extends ethereum.Call {
  get inputs(): SetGasPriceCall__Inputs {
    return new SetGasPriceCall__Inputs(this);
  }

  get outputs(): SetGasPriceCall__Outputs {
    return new SetGasPriceCall__Outputs(this);
  }
}

export class SetGasPriceCall__Inputs {
  _call: SetGasPriceCall;

  constructor(call: SetGasPriceCall) {
    this._call = call;
  }

  get _gasPrice(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetGasPriceCall__Outputs {
  _call: SetGasPriceCall;

  constructor(call: SetGasPriceCall) {
    this._call = call;
  }
}

export class SetReserveRatioCall extends ethereum.Call {
  get inputs(): SetReserveRatioCall__Inputs {
    return new SetReserveRatioCall__Inputs(this);
  }

  get outputs(): SetReserveRatioCall__Outputs {
    return new SetReserveRatioCall__Outputs(this);
  }
}

export class SetReserveRatioCall__Inputs {
  _call: SetReserveRatioCall;

  constructor(call: SetReserveRatioCall) {
    this._call = call;
  }

  get _reserveRatio(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetReserveRatioCall__Outputs {
  _call: SetReserveRatioCall;

  constructor(call: SetReserveRatioCall) {
    this._call = call;
  }
}

export class PauseCall extends ethereum.Call {
  get inputs(): PauseCall__Inputs {
    return new PauseCall__Inputs(this);
  }

  get outputs(): PauseCall__Outputs {
    return new PauseCall__Outputs(this);
  }
}

export class PauseCall__Inputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class PauseCall__Outputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class UnpauseCall extends ethereum.Call {
  get inputs(): UnpauseCall__Inputs {
    return new UnpauseCall__Inputs(this);
  }

  get outputs(): UnpauseCall__Outputs {
    return new UnpauseCall__Outputs(this);
  }
}

export class UnpauseCall__Inputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}

export class UnpauseCall__Outputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}
