import { EitherInterface } from "./inner-either.interface";

export abstract class InnerRight<L, R> extends EitherInterface<L, R> {
  constructor(protected readonly value: R) {
    super();
  }

  protected get isInnerLeft(): boolean {
    return false;
  }

  protected get isInnerRight(): boolean {
    return true;
  }

  protected get unwrapInnerLeft(): L {
    throw new Error("EitherSelectorError: this either is'nt left");
  }

  protected get unwrapInnerRight(): R {
    return this.value;
  }

  map<NL, NR>(
    left: (value: L) => EitherInterface<NL, NR>,
    right: (value: R) => InnerRight<NL, NR>
  ): InnerRight<NL, NR> {
    return right(this.value);
  }

  reduce<NL, NR>(
    list: InnerRight<L, R>[],
    base: InnerRight<NL, NR>,
    left: (value: L, base: NL) => EitherInterface<NL, NR>,
    right: (value: R, base: NR) => InnerRight<NL, NR>
  ): InnerRight<NL, NR> | undefined {
    if (base.isInnerLeft) return undefined;

    let result = base;
    for (let item of list) {
      if (item.isInnerLeft) return undefined;
      result = right(item.unwrapInnerRight, base.unwrapInnerRight);
    }

    return result;
  }
}
