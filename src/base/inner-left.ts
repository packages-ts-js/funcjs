import { EitherInterface } from "./inner-either.interface";

export abstract class InnerLeft<L, R> extends EitherInterface<L, R> {
  constructor(protected readonly value: L) {
    super();
  }

  protected get isInnerLeft(): boolean {
    return true;
  }

  protected get isInnerRight(): boolean {
    return false;
  }

  protected get unwrapInnerLeft(): L {
    return this.value;
  }

  protected get unwrapInnerRight(): R {
    throw new Error("EitherSelectorError: this either is'nt right");
  }

  map<NL, NR>(
    left: (value: L) => InnerLeft<NL, NR>,
    right: (value: R) => EitherInterface<NL, NR>
  ): InnerLeft<NL, NR> {
    return left(this.value);
  }

  reduce<NL, NR>(
    list: InnerLeft<L, R>[],
    base: InnerLeft<NL, NR>,
    left: (value: L, base: NL) => InnerLeft<NL, NR>,
    right: (value: R, base: NR) => EitherInterface<NL, NR>
  ): InnerLeft<NL, NR> | undefined {
    if (base.isInnerRight) return undefined;

    let result = base;
    for (let item of list) {
      if (item.isInnerRight) return undefined;
      result = left(item.unwrapInnerLeft, base.unwrapInnerLeft);
    }

    return result;
  }
}
