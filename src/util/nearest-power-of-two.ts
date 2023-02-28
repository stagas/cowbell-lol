// chatgpt
export function nearestPowerOfTwo(x: number): number {
  // If x is already a power of two, return it
  if ((x & (x - 1)) === 0) {
    return x;
  }

  // Find the nearest power of two greater than x
  let power = 1;
  while (power < x) {
    power <<= 1;
  }
  return power;
}

export function nearestMultipleOfPowerOfTwo(x: number): number {
  let p = x;
  while (x % Math.pow(2, p + 1) === 0) {
    p++;
  }
  return p;
}
