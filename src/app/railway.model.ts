import { TreeError } from '@angular/compiler';

/**
 * @description Result class with success, error and data state
 */
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

  // adapter function (alternate name: bind)
  /**
   * @description calls switchFn on success, Fails otherwise
   * @returns Result<TOut>
   * @param switchFn function that takes single input and outputs Result<TOut>
   */
  onSuccess<TOut>(switchFn: (x: TData) => Result<TOut>): Result<TOut> {
    return this.isSuccess ? switchFn(this.data) : Result.Fail(this.error);
  }

  // adapter function
  /**
   * @description calls singleTrackFn on success, Fails otherwise
   * @returns Result<TOut>
   * @param singleTrackFn function that takes single input and outputs single output  of type TOut
   */
  map<TOut>(singleTrackFn: (x: TData) => TOut): Result<TOut> {
    return this.isSuccess
      ? Result.Success<TOut>(singleTrackFn(this.data))
      : Result.Fail(this.error);
  }

  // adapter function (alternate name: tee)
  /**
   * @description calls deadFn on success, ignoring result
   * @returns Result<TOut> returns 'this' ignoring deadFn' s result
   * @param deadEndFn function that takes single input and outputs nothing
   */
  alsoCallOnSuccess(deadEndFn: (x: TData) => void) {
    if (this.isSuccess) {
      deadEndFn(this.data);
    }
    return this;
  }

  // constructor function
  /**
   * @description returns Success Result of singleTrackFn's result
   * @returns Result<TOut>
   * @param singleTrackFn function that takes single input and outputs single output  of type TOut
   */
  succeed<TOut>(singleTrackFn: (x: TData) => TOut): Result<TOut> {
    return Result.Success<TOut>(singleTrackFn(this.data));
  }

  // exception handling
  /**
   * @description on success, calls singleTrackFn. Fails otherwise or on exception (uses CustomError)
   * @returns Result<TOut>
   * @param singleTrackFn function that takes single input and outputs single output  of type TOut
   */
  tryCatchSwitch<TOut>(singleTrackFn: (x: TData) => TOut): Result<TOut> {
    try {
      return this.isSuccess
        ? Result.Success<TOut>(singleTrackFn(this.data))
        : Result.Fail<TOut>(this.error);
    } catch {
      Result.Fail<TOut>(CustomError.ExceptionRaised);
    }
  }

  // boolean to Result
  /**
   * @description on success, uses singleTrackFn's result to output Success or Fail
   * @returns Result<TOut>
   * @param singleTrackFn function that takes single input and outputs boolean
   */
  booleanSwitch(singleTrackFn: (x: TData) => boolean): Result<boolean> {
    if (this.isSuccess) {
      return singleTrackFn(this.data)
        ? Result.Success<boolean>(true)
        : Result.Fail<boolean>(CustomError.ReturnedFalse);
    }
    return Result.Fail<boolean>(this.error);
  }

  // supervisory function (alternate name: doubleMap)
  /**
   * @description on success, calls successSingleTrackFn. Calls failureSingleTrackFn otherwise
   * @returns Result<TOut> either successSingleTrackFn's result or this.error
   * @param successSingleTrackFn function that takes single input and outputs single output  of type TOut
   * @param failureSingleTrackFn function that takes single input and outputs single output  of type TOut
   */
  onBoth<TOut>(
    successSingleTrackFn: (x: TData) => TOut,
    failureSingleTrackFn: (x: TData) => TOut
  ): Result<TOut> {
    // call on success
    if (this.isSuccess) {
      return Result.Success(successSingleTrackFn(this.data));
    }

    // call on failure
    failureSingleTrackFn(this.data);
    return Result.Fail<TOut>(this.error);
  }

  // handler
  /**
   * @description calls either handler.success or handler.fail
   * @returns HandlerReply<TOut> output of handler.success or handler.fail
   * @param handler Handler<TData, TOut>
   */
  handle<TOut>(handler: Handler<TData, TOut>): HandlerReply<TOut> {
    return this.isSuccess
      ? handler.success(this.data)
      : handler.fail(this.data);
  }
}

export interface HandlerReply<T> { data: T; }

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
