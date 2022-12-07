// credits: ChatGPT

export class ObjectPool<T> {
  private readonly pool: T[];

  constructor(private readonly factory: () => T | Promise<T>) {
    this.pool = [];
  }

  public acquire(): T | Promise<T> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  public release(obj: T): void {
    this.pool.push(obj);
  }
}
