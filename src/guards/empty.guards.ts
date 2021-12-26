import { BaseError } from "../errors/base-errors";
import { Fail, Ok, Result } from "../result";

class EmptyError extends BaseError {
  constructor(message: string) {
    super({
      code: 10,
      message: message,
      name: "EmptyError",
    });
  }
}

export function notEmpty<T, TProps>(
  name: string,
  func: (obj: T) => TProps
): (v: T) => Result<T> {
  return (v: T) => {
    const value = func(v);
    if (
      typeof value === "undefined" ||
      value === null ||
      (typeof value === "string" && value === "")
    )
      return Fail(new EmptyError(`${name} is empty`));
    return Ok(v);
  };
}

export function Empty<T, TProps>(
  name: string,
  func: (obj: T) => TProps
): (v: T) => Result<T> {
  return (v: T) => {
    const value = func(v);
    if (
      typeof value === "undefined" ||
      value === null ||
      (typeof value === "string" && value === "")
    )
      return Ok(v);
    return Fail(new EmptyError(`${name} is'nt empty`));
  };
}
