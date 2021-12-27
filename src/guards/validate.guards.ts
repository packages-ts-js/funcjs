import { BaseError } from "../errors/base-errors";
import { Fail, Ok, Result } from "../result";

class ValidateError extends BaseError {
  constructor(message: string) {
    super({ message, code: 400, name: "ValidateError" });
  }
}

export function Validate<T>(
  func: (v: T) => boolean,
  message: string = "validate error"
): (v: T) => Result<T> {
  return (value) => {
    return func(value) ? Ok(value) : Fail(new ValidateError(message));
  };
}
