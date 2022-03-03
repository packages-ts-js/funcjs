import { isEmpty } from "class-validator";

export interface Maybe<T> {
  get isNone(): boolean;
  get isSome(): boolean;
  unwrap(): T;
  withValueDo<R>(func: (value: T) => R): Maybe<R>;
  withNothingDo(func: () => T): Maybe<T>;
  and<R>(other: Maybe<R>, by: (a: T, b: R) => T): Maybe<T>;
  or<R>(other: Maybe<R>): Maybe<T>;
  // okOr<E extends ResultErrorInterface>(err: E): Result<T>;
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

  withValueDo<R>(func: (value: T) => R): Maybe<R> {
    return Just(func(this.value));
  }

  withNothingDo(func): Maybe<T> {
    return this;
  }

  and<R>(other: Maybe<R>, by: (a: T, b: R) => T): Maybe<T> {
    return other.withValueDo((value) => by(this.value, value)).or(this);
  }

  or<R>(other: Maybe<R>): Maybe<T> {
    return this;
  }

  //   tryDoWith<R>(other: Maybe<R>, by: (a: T, b: R) => T): Maybe<T> {
  //     return other
  //       .withValueDo((value) => by(this.value, value))
  //       .tryDoWith(this, (a, b) => a);
  //   }
  //   okOr<E extends ResultErrorInterface>(err: E): Result<T> {
  //     return Ok(this.value);
  //   }
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

  withValueDo<R>(func: (value: any) => R): Maybe<R> {
    return this;
  },

  withNothingDo(func: () => any): Maybe<any> {
    return Just(func());
  },

  and<R>(other: Maybe<R>, by: (a: any, b: R) => any): Maybe<any> {
    return other;
  },

  or<R>(other: Maybe<R>): Maybe<any> {
    return other;
  },
};
