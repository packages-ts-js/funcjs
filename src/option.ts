import { isEmpty } from "class-validator";
import { BaseError } from "./errors/base-errors";
import { ResultErrorInterface, Result, Fail, Ok } from "./result";

export interface IOptional<T> {
  get isNone(): boolean;
  get isSome(): boolean;
  unwrap(): T;
  okOr<E extends ResultErrorInterface>(err: E): Result<T>;
}

export function Optional<T>(value: T): IOptional<T> {
  if (isEmpty(value)) return None;
  return new Some(value);
}

class OptionsError extends BaseError {
  constructor(message: string) {
    super({
      message,
      code: 9,
      name: "OptionsError",
    });
  }
}

export class Some<T> implements IOptional<T> {
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

export const None: IOptional<any> = {
  get isNone(): boolean {
    return true;
  },

  get isSome(): boolean {
    return false;
  },

  unwrap() {
    throw new OptionsError("Can't unwrapping 'None' value").throw();
  },

  okOr<E extends ResultErrorInterface>(err: E): Result<any> {
    return Fail(err);
  },
};
