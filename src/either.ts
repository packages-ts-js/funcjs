import { IOptional } from "./option";
import { InnerLeft } from "./base/inner-left";
import { InnerRight } from "./base/inner-right";
import { None, Some } from "./option";

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

export class EitherComparer<L, R> {
  constructor(
    private readonly leftCmp: (value: L | R, left: L) => boolean = (v, l) =>
      v === l,
    private readonly rightCmp: (value: L | R, left: R) => boolean = (v, r) =>
      v === r
  ) {}

  compare(value: L | R, left: L): Either<L, R>;
  compare(value: L | R, left: L, right: R): IOptional<Either<L, R>>;
  compare(value: L | R, left: L, right?: R): any {
    if (!right)
      return this.leftCmp(value, left) ? new Left(value) : new Right(value);

    if (this.leftCmp(value, left)) return new Some(new Left(value));
    if (this.rightCmp(value, right)) return new Some(new Right(value));

    return None;
  }
}
