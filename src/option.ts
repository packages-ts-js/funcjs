import { isEmpty } from "class-validator";
import { ResultErrorInterface, Result, Fail, Ok } from "./result";

export interface Maybe<T> {
  get isNone(): boolean;
  get isSome(): boolean;
  unwrap(): T;
  okOr<E extends ResultErrorInterface>(err: E): Result<T>;
}

export function Optional<T>(value: T): Maybe<T> {
  if (isEmpty(value)) return Nothing;
  return new Some(value);
}

export function Just<T>(value: T): Maybe<T> {
  return new Some(value);
}

class Some<T> implements Maybe<T> {
  constructor(private readonly value: T) {}

  get isNone(): boolean {
    return false;
  }
  get isSome(): boolean {
    return true;
  }
  unwrap(): T {
    return this.value;
  }
  okOr<E extends ResultErrorInterface>(err: E): Result<T> {
    return Ok(this.value);
  }
}

export const Nothing: Maybe<any> = {
  get isNone(): boolean {
    return true;
  },

  get isSome(): boolean {
    return false;
  },

  unwrap() {
    throw new Error("Can't unwrapping 'None' value");
  },

  okOr<E extends ResultErrorInterface>(err: E): Result<any> {
    return Fail(err);
  },
};
