export async function concurrentMemoFibonacci(n: number): Promise<number> {
  // TODO: implement a memoized and concurrency-safe Fibonacci function
  
  const cached = cache.get(n)
  if (cached !== undefined) {
    return Promise.resolve(cached)
  }

  let result: number;

  if (n == 0) {
    result = 0
  } else if ( n == 1) {
    result = 1
  } else {
    const [r1, r2] = await Promise.all([concurrentMemoFibonacci(n - 1), concurrentMemoFibonacci(n - 2)]);
    result = r1 + r2
  }
  
  setTimeout(() => { console.log('calculating...'); }, 1000);
  cache.set(n, result)
  return Promise.resolve(result)
}

const cache = new Map<number, number>();
