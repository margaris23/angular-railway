import { Injectable } from '@angular/core';

import { CustomError, Handler, HandlerReply, Result } from '../railway.model';
import { PaymentFormModel } from './payment-form.model';

interface ServerPayload { payload: number; }
export interface ServerReply { payload: any; }
export interface ServiceError { error: CustomError; }

@Injectable({ providedIn: 'root' })
export class PaymentService extends Handler<ServerPayload, ServerReply | ServiceError> {

  constructor() {
    super();
  }

  save(model: PaymentFormModel) {
    return this.validateAccount(model.ownerName)
      .onSuccess(() => this.validateCard(model.cardNumber))
      .tryCatchSwitch(() => this.charge(100))
      .map(chargedAmount => this.double(chargedAmount))
      .alsoCallOnSuccess(() => console.log('Dead end function'))
      .onBoth(console.log, console.error)
      .handle(this);
  }

  validateCard(card: string): Result<boolean> {
    return Result.Success(true);
  }

  validateAccount(name: string): Result<string> {
    return name != null && name !== '' ? Result.Success(name) : Result.Fail(CustomError.NameNotExist);
  }

  charge(amount: number): number {
    return amount;
  }

  double(amount: number): Result<number> {
    return Result.Success(2 * amount);
  }

  success(data: any): HandlerReply<ServerReply | ServiceError> {
    return { data: { payload: 200 } };
  }

  fail(data: any): HandlerReply<ServerReply | ServiceError> {
    return { data: {error: CustomError.Fail} };
  }
}
