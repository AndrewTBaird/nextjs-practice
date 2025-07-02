import { concurrentMemoFibonacci } from "../src/index";

jest.useFakeTimers();

describe("concurrentMemoFibonacci", () => {
  // it("computes fibonacci numbers concurrently without duplication", async () => {
  //   const spy = jest.spyOn(global, "setTimeout");

  //   const p1 = concurrentMemoFibonacci(10);
  //   const p2 = concurrentMemoFibonacci(10);
  //   const p3 = concurrentMemoFibonacci(9);

  //   // Advance timers to trigger all setTimeout callbacks
  //   jest.runAllTimers();

  //   const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
  //   expect(r1).toBe(55);
  //   expect(r1).toBe(r2);
  //   expect(r3).toBe(34);
  //   expect(spy).toHaveBeenCalledTimes(11); // 0..10
  // });

  it("returns the correct fibonacci calculation when testing without concurrency", async () => {
    const result = await concurrentMemoFibonacci(10);
    expect(result).toBe(55)
  })

  it("returns 0 when n == 0", async () => {
    const result = await concurrentMemoFibonacci(0);
    expect(result).toBe(0)
  })

  it("returns 1 when n == 1", async () => {
    const result = await concurrentMemoFibonacci(1);
    expect(result).toBe(1)
  })
});
