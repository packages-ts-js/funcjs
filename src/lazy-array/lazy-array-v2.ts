export function lazyEval<T>(list: Array<T>): LazyArray<T> {
  return new LazyArray(list);
}

type Monad<T, R> = (value: T) => R;
type Predicate<T> = (value: T) => boolean;
type Reductor<T, R> = (a: R, b: T) => R;

class LazyArray<T> {
  private monadFunc: Array<Monad<any, any>> = [];
  private predicate: Array<Predicate<any>> = [];

  constructor(private readonly array: Array<T>) {}

  map<R>(func: Monad<T, R>): LazyArray<R> {
    this.monadFunc.push(func);
    return this as any;
  }

  filter(func: Predicate<T>): LazyArray<T> {
    this.predicate.push(func);
    return this;
  }

  reduce<R>(func: Reductor<T, R>, base: R): R {
    let result = base;

    for (let index = 0; index < this.array.length; index++) {
      this.array[index] = this.monadFunc.reduce(
        (item, func) => func(item),
        this.array[index]
      );

      if (
        typeof this.predicate.find((f) => !f(this.array[index])) !== "undefined"
      )
        continue;

      result = func(result, this.array[index]);
    }

    this.monadFunc = [];
    this.predicate = [];
    return result;
  }
}
