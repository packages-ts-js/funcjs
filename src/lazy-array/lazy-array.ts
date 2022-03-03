import { Just, Maybe, Nothing } from "./maybe";

export function lazyEvalV1<T>(list: Array<T>): LazyArray<T> {
  return new LazyArray(list, [], {});
}

class LazyArray<T> {
  constructor(
    private readonly array: Array<any>,
    private readonly monadFunc: Array<(value: any) => any>,
    private readonly monadDictApplication: Record<number, number>
  ) {}

  private computingValue(i: number): void {
    let result = this.array[i];

    for (
      let index = this.monadDictApplication[i] ?? 0;
      index < this.monadFunc.length;
      index++
    )
      result = this.monadFunc[index](result);

    this.monadDictApplication[i] = this.monadFunc.length;
    this.array[i] = result;
  }

  map<R>(func: (value: T) => R): LazyArray<R> {
    this.monadFunc.push(func);
    return new LazyArray<R>(
      this.array,
      this.monadFunc,
      this.monadDictApplication
    );
  }

  filter(func: (value: T) => boolean): LazyArray<Maybe<T>> {
    this.monadFunc.push((value) => (func(value) ? Just(value) : Nothing));
    return new LazyArray<Maybe<T>>(
      this.array,
      this.monadFunc,
      this.monadDictApplication
    );
  }

  andFilter<R>(func: (value: R) => boolean): LazyArray<T> {
    this.monadFunc.push((value) =>
      value.isSome && func(value.unwrap()) ? Just(value.unwrap()) : Nothing
    );
    return new LazyArray<T>(
      this.array,
      this.monadFunc,
      this.monadDictApplication
    );
  }

  reduce<R>(func: (a: R, b: T) => R, base: R): R {
    let result = base;

    for (let index = 0; index < this.array.length; index++) {
      this.computingValue(index);
      result = func(result, this.array[index]);
    }

    return result;
  }

  find(func: (a: T) => boolean): Maybe<T> {
    for (let index = 0; index < this.array.length; index++) {
      this.computingValue(index);
      if (func(this.array[index])) return Just(this.array[index]);
    }

    return Nothing;
  }

  getValueByIndex(index: number) {
    this.computingValue(index);
    return this.array[index];
  }

  toArray() {
    for (let index = 0; index < this.array.length; index++)
      this.computingValue(index);

    return this.array;
  }
}
