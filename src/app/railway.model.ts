export class Result<TData> {
  private constructor(public readonly data: TData | Error, public readonly isError: boolean) { }

  static Success<T>(data: T) {
    return new Result<T>(data, false);
  }

  static Fail<T>(data: T) {
    return new Result(data, true);
  }
}

export function bind(data: any, fn) {

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
