import { Combined, Result } from "../result";

export function Guards<T>(...funcs: ((obj: T) => Result<T>)[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const results = [];
      for (const f of funcs) results.push(f(args[0]));
      let result = Combined(results).map((v: T) => {
        args.shift();
        return originalMethod.apply(this, [v].concat(args));
      });
      return result;
    };
  };
}
