import { TreeError } from '@angular/compiler';

export class Result<TData> {
  get isSuccess() {
    return !this.isError;
  }

  get isError() {
    return this.error != null;
  }

  private constructor(public readonly data?: TData, public readonly error?: CustomError) { }

  static Success<T>(data: T) {
    return new Result<T>(data);
  }

  static Fail<T>(error: CustomError) {
    return new Result<T>(null, error);
  }

  // handler
  handle<TOut>(handler: Handler<TData, TOut>): HandlerReply<TOut> {
    return this.isSuccess
      ? handler.success(this.data)
      : handler.fail(this.data);
  }

  // adapter (bind)
  onSuccess<TOut>(switchFn: (x: TData) => Result<TOut>): Result<TOut> {
    return this.isSuccess ? switchFn(this.data) : Result.Fail(this.error);
  }

  // adapter
  map<TOut>(singleTrackFn: (x: TData) => TOut): Result<TOut> {
    return this.isSuccess
      ? Result.Success<TOut>(singleTrackFn(this.data))
      : Result.Fail(this.error);
  }

  // adapter
  tee(deadEndFn: (x: TData) => void) {
    if (this.isSuccess) {
      deadEndFn(this.data);
    }
    return this;
  }

  // constructor
  succeed<TOut>(singleTrackFn: (x: TData) => TOut): Result<TOut> {
    return Result.Success<TOut>(singleTrackFn(this.data));
  }

  // exception handling
  tryCatchSwitch<TOut>(singleTrackFunction: (x: TData) => TOut): Result<TOut> {
    try {
      return this.isSuccess
        ? Result.Success<TOut>(singleTrackFunction(this.data))
        : Result.Fail<TOut>(this.error);
    } catch {
      Result.Fail<TOut>(CustomError.ExceptionRaised);
    }
  }

  // boolean to Result
  booleanSwitch(singleTrackFn: (x: TData) => boolean): Result<boolean> {
    if (this.isSuccess) {
      return singleTrackFn(this.data)
        ? Result.Success<boolean>(true)
        : Result.Fail<boolean>(CustomError.ReturnedFalse);
    }
    return Result.Fail<boolean>(this.error);
  }

  // supervisory (doubleMap)
  onBoth<TOut>(
    successSingleTrackFn: (x: TData) => TOut,
    failureSingleTrackFn: (x: TData) => TOut
  ): Result<TOut> {
    if (this.isSuccess) {
      return Result.Success(successSingleTrackFn(this.data));
    }

    failureSingleTrackFn(this.data);

    return Result.Fail<TOut>(this.error);
  }
}

export interface HandlerReply<T> {
  data: T;
}

export abstract class Handler<TData, TOut> {
  abstract success(data: TData): HandlerReply<TOut>;
  abstract fail(error: TData): HandlerReply<TOut>;
}

export enum CustomError {
  Fail,
  ReturnedFalse,
  ExceptionRaised,

  // validation
  ValidationFailed,
  IvalidNumber,
  NameNotExist,

  // server
  CardExpired,
}
