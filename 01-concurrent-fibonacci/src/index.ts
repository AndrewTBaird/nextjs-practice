const cache = new Map<number, Promise<number>>();

export async function concurrentMemoFibonacci(n: number): Promise<number> {
  // Check to see if there is already a cached promise
  const cached = cache.get(n);
  if (cached !== undefined) {
    return cached; // Return the existing promise if it exists
  }
  const promise = calculateFibonacci(n);
  //Cache the promise right after it is initiated
  cache.set(n, promise);

  return promise;
}

async function calculateFibonacci(n: number): Promise<number> {
  setTimeout(() => { console.log('expensive calculation...'); }, 1000);

  let result: number;

  if (n == 0) {
    result = 0
  } else if ( n == 1) {
    result = 1
  } else {
    const [r1, r2] = await Promise.all([concurrentMemoFibonacci(n - 1), concurrentMemoFibonacci(n - 2)]);
    result = r1 + r2
  }

  return Promise.resolve(result)
}

