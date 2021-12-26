export abstract class EitherInterface<L, R> {
  protected abstract get isInnerLeft(): boolean;
  protected abstract get isInnerRight(): boolean;
  protected abstract get unwrapInnerLeft(): L;
  protected abstract get unwrapInnerRight(): R;

  abstract map<NL, NR>(
    left: (value: L) => EitherInterface<NL, NR>,
    right: (value: R) => EitherInterface<NL, NR>
  ): EitherInterface<NL, NR>;

  abstract reduce<NL, NR>(
    list: EitherInterface<L, R>[],
    base: EitherInterface<NL, NR>,
    left: (value: L, base: NL) => EitherInterface<NL, NR>,
    right: (value: R, base: NR) => EitherInterface<NL, NR>
  ): EitherInterface<NL, NR> | undefined;
}
