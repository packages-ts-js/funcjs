import { lazyEvalV1 } from "./lazy-array";
import { lazyEval } from "./lazy-array-v2";
import { Just } from "./maybe";

describe("Lazy Array Test:", () => {
  let list = [];
  let result = 0;
  beforeEach(() => {
    list = Array(10000000)
      .fill(1)
      .map((i, j) => j);
  });

  it("simple array example with map", () => {
    result = list
      .map((i) => i + 1)
      .map((i) => i * 2)
      .map((i) => i + 100)

      .filter((i) => i < 200)
      .filter((i) => i > 100)
      .reduce((a, b) => a + b, 0);

    expect(result > 0).toBe(true);
  });

  it("simple array example in unique for", () => {
    let _result = 0;
    for (const item of list) {
      let temp = item + 1;
      temp = temp * 2;
      temp = temp + 100;

      if (!(temp < 200)) continue;
      if (!(temp > 100)) continue;

      _result += temp;
    }

    expect(_result > 0).toBe(true);
  });

  it("lazy array example", () => {
    let a = lazyEvalV1<number>(list)
      .map((i) => i + 1)
      .map((i) => i * 2)
      .map((i) => i + 100)
      .filter((i) => i < 200)
      .andFilter((i) => i > 100)
      .reduce((a, b) => a.and(b, (a, b) => a + b), Just(0))
      .unwrap();
    // .reduce((a, b) =>, 0);
    console.log(a, result);
    expect(result === a).toBe(true);
  });

  it("lazy array example", () => {
    let a = lazyEval<number>(list)
      .map((i) => i + 1)
      .map((i) => i * 2)
      .map((i) => i + 100)
      .filter((i) => i < 200)
      .reduce((a, b) => a + b, 0);
    // .reduce((a, b) =>, 0);
    console.log(a, result);
    expect(result === a).toBe(true);
  });
});
