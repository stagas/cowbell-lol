export class ObjectPool<T, U = undefined> {
  poolMap = new Map<string | undefined, T[]>();
  objectMap = new Map<T, string | undefined>();

  constructor(
    public factory: (options?: any) => T | Promise<T>,
    public reviver: (item: T) => T | Promise<T>
  ) { }

  async acquire(options?: U): Promise<T> {
    const key = JSON.stringify(options)
    const pool = this.poolMap.get(key)
    if (pool && pool.length > 0) {
      return this.reviver(pool.pop()!);
    }

    const obj = await this.factory(options);
    this.objectMap.set(obj, key);
    return obj;
  }

  release(obj: T): void {
    let pool = this.poolMap.get(this.objectMap.get(obj));
    if (!pool) {
      pool = [];
      this.poolMap.set(this.objectMap.get(obj), pool);
    }
    pool.push(obj);
  }

  dispose(obj: T): void {
    this.objectMap.delete(obj)
  }
}
