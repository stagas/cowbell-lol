// credits: ChatGPT

export class ObjectPool<T> {
  private readonly pool: T[];

  constructor(private readonly factory: () => T | Promise<T>, private readonly reviver: (item: T) => T | Promise<T>) {
    this.pool = [];
  }

  public acquire(): T | Promise<T> {
    if (this.pool.length > 0) {
      return this.reviver(this.pool.pop()!);
    }
    return this.factory();
  }

  public release(obj: T): void {
    this.pool.push(obj);
  }
}
