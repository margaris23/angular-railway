import { Injectable } from '@angular/core';

import { CustomError, Handler, HandlerReply, Result } from './railway.model';

interface ServerPayload { payload: number; }
interface ServerReply { payload: any; }

@Injectable({ providedIn: 'root' })
export class RailwayService extends Handler<ServerPayload, ServerReply | CustomError> {

  constructor() {
    super();

    console.log('RESULT:', this.validate(3));
  }

  validate(amount) {
    return this.validateAccount()
      .onSuccess(() => this.validateAmount(amount))
      .tryCatchSwitch(() => this.charge(amount))
      .onBoth(console.log, console.error)
      .handle(this);
  }

  validateAccount(): Result<boolean> {
    return Result.Success(true);
  }

  validateAmount(amount: number): Result<number> {
    return Result.Success(amount);
  }

  charge(amount): Result<boolean> {
    return Result.Success(true);
  }

  success(data: any): HandlerReply<ServerReply | CustomError> {
    return { data: { payload: 200 } };
  }

  fail(data: any): HandlerReply<ServerReply | CustomError> {
    return { data: CustomError.Fail };
  }
}
