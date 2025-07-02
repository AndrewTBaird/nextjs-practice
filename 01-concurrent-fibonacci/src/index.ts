export async function concurrentMemoFibonacci(n: number): Promise<number> {
  // TODO: implement a memoized and concurrency-safe Fibonacci function
  //start with a basic fibonacci implementation
  //then, add in memoization concept, maybe a hash can act as the memo
  if (n == 0) {
    return Promise.resolve(0)
  } else if ( n == 1) {
    return Promise.resolve(1)
  } else {
    const [r1, r2] = await Promise.all([concurrentMemoFibonacci(n - 1), concurrentMemoFibonacci(n - 2)]);
    return Promise.resolve(r1 + r2)
  } 
}
