import { InnerLeft } from "./base/inner-left";
import { InnerRight } from "./base/inner-right";
import { Maybe, Just, Nothing } from "./option";

export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> extends InnerLeft<L, R> {
  isLeft(): boolean {
    return super.isInnerLeft;
  }

  isRight(): boolean {
    return super.isInnerRight;
  }

  unwrapLeft(): L {
    return super.unwrapInnerLeft;
  }

  unwrapRight(): R {
    return super.unwrapInnerRight;
  }

  mapLeft<NL>(func: (value: L) => NL): Either<NL, R> {
    return new Left(func(this.value));
  }

  mapRight<NR>(func: (value: R) => NR): Either<L, NR> {
    return this as any;
  }
}

export class Right<L, R> extends InnerRight<L, R> {
  isLeft(): boolean {
    return super.isInnerLeft;
  }

  isRight(): boolean {
    return super.isInnerRight;
  }

  unwrapLeft(): L {
    return super.unwrapInnerLeft;
  }

  unwrapRight(): R {
    return super.unwrapInnerRight;
  }

  mapLeft<NL>(func: (value: L) => NL): Either<NL, R> {
    return this as any;
  }

  mapRight<NR>(func: (value: R) => NR): Either<L, NR> {
    return new Right(func(this.value));
  }
}

export function EitherSelect<L, R>(
  value: L | R,
  isLeft: (value: L) => boolean,
  isRight?: (value: R) => boolean
): Maybe<Either<L, R>> {
  if (isLeft(value as L)) return Just(new Left(value as L));
  if (isRight && isRight(value as R)) return Just(new Right(value as R));
  return Nothing;
}
