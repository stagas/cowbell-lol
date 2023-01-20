export class ChecksumSet<T extends { id: number, checksum: number }> {
  items = new Map<number, T>()
  itemsIds = new Map<number, number>()

  put(item: T) {
    const prevItem = this.items.get(item.checksum)
    if (prevItem) return prevItem

    const prevChecksum = this.itemsIds.get(item.id)
    if (prevChecksum && prevChecksum !== item.checksum) {
      this.items.delete(prevChecksum)
    }

    this.items.set(item.checksum, item)
    this.itemsIds.set(item.id, item.checksum)

    return item
  }

  get(id: number) {
    const checksum = this.itemsIds.get(id)
    if (checksum) {
      return this.items.get(checksum)
    }
  }
}
