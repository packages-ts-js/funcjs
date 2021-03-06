import { InternalServerError } from "./errors/application.error";

export interface ResultErrorInterface {
  throw: () => void;
  pretty: () => string;
}

export type Result<T> = ResultOk<T> | ResultFail<T>;

export function Ok<T>(value: T): Result<T> {
  return new ResultOk(value);
}

export function Fail<T>(value: ResultErrorInterface): Result<T> {
  return new ResultFail(value);
}

export function Combined(results: Result<any>[]): Result<any> {
  return results.reduce((a, b) => a.and(b), new ResultOk(null));
}

class ResultOk<T> {
  constructor(private readonly value: T) {}

  get success(): boolean {
    return true;
  }

  get fail(): boolean {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapError(): ResultErrorInterface {
    throw new Error("ResultError: this result is'nt error");
  }

  map<TOther>(
    func: (value: T) => Result<TOther>,
    err: new (msg: string) => ResultErrorInterface = InternalServerError,
    msg?: string
  ): Result<TOther> {
    try {
      return func(this.value);
    } catch (e) {
      return Fail(new err(msg));
    }
  }

  elseMap(
    func: () => Result<T>,
    err: new (msg: string) => ResultErrorInterface = InternalServerError,
    msg?: string
  ): Result<T> {
    return this;
  }

  and(other: Result<any>): Result<T> {
    return other;
  }
}

export class ResultFail<T> {
  constructor(private readonly value: ResultErrorInterface) {}

  get success(): boolean {
    return false;
  }

  get fail(): boolean {
    return true;
  }

  unwrap(): T {
    throw new Error("ResultError: this result is'nt success");
  }

  unwrapError(): ResultErrorInterface {
    return this.value;
  }

  map<TOther>(
    func: (value: T) => Result<TOther>,
    err: new (msg: string) => ResultErrorInterface = InternalServerError,
    msg?: string
  ): Result<TOther> {
    return this as any;
  }

  elseMap(
    func: () => Result<T>,
    err: new (msg: string) => ResultErrorInterface = InternalServerError,
    msg?: string
  ): Result<T> {
    try {
      return func();
    } catch (e) {
      return Fail(new err(msg));
    }
  }

  and(other: Result<any>): Result<T> {
    return this;
  }
}
