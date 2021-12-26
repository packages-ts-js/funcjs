import { BaseError } from "./base-errors";

export class InternalServerError extends BaseError {
  constructor(message: string = "unexpected error") {
    super({
      message,
      code: 500,
      name: "ApplicationError",
    });
  }
}
