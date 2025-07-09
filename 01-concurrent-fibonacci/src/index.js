"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concurrentMemoFibonacci = concurrentMemoFibonacci;
const cache = new Map();
async function concurrentMemoFibonacci(n) {
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
async function calculateFibonacci(n) {
    setTimeout(() => { console.log('expensive calculation...'); }, 1000);
    let result;
    if (n == 0) {
        result = 0;
    }
    else if (n == 1) {
        result = 1;
    }
    else {
        const [r1, r2] = await Promise.all([concurrentMemoFibonacci(n - 1), concurrentMemoFibonacci(n - 2)]);
        result = r1 + r2;
    }
    return Promise.resolve(result);
}
