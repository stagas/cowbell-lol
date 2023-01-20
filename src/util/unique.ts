// credits: chat-gpt
export function unique<T extends { id?: string }>(arr: T[]): T[] {
  const uniqueIds = new Set();

  return arr.reduce((acc, obj) => {
    // Check if the object's id is in the Set of unique ids
    if (!uniqueIds.has(obj.id)) {
      // If it is not, add the object to the accumulator array
      // and add its id to the Set of unique ids
      acc.push(obj);
      uniqueIds.add(obj.id);
    }
    return acc;
  }, [] as T[]);
}
