import { ResultErrorInterface } from "../result";

type BaseErrorProps = {
  code: number;
  name: string;
  message: string;
};

export abstract class BaseError extends Error implements ResultErrorInterface {
  constructor({ code, name, message }: BaseErrorProps) {
    super(message);
    Object.defineProperty(this, "name", { value: name });
  }

  throw(): void {
    throw this;
  }

  pretty(): string {
    return `[${this.name}]: ${this.message}`;
  }
}
