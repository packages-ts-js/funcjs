import assert from "assert";

export function Guards<T>(...funcs: ((obj: T) => boolean)[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      funcs.forEach((f, i) => {
        assert(f(args[0]), `AssertError: [func: ${propertyKey}] [guard: ${i}]`);
      });

      return originalMethod.apply(this, args);
    };
  };
}

export class Guard<T> {
  private readonly fs: ((obj: T) => boolean)[];
  constructor(
    private readonly name: string,
    ...funcs: ((obj: T) => boolean)[]
  ) {
    this.fs = funcs;
  }

  private assert(obj: T, context?: string) {
    this.fs.forEach((f, i) => {
      assert(
        f(obj),
        `AssertError: [context: ${context ?? "where"}] [guard-${i}: ${
          this.name
        }]`
      );
    });
  }

  where(obj: T, context?: string): T {
    this.assert(obj, context);
    return obj;
  }

  Where(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    let test = (obj) => this.assert(obj, propertyKey);

    descriptor.value = async function (...args: any[]) {
      test(args[0]);
      return originalMethod.apply(this, args);
    };
  }
}
