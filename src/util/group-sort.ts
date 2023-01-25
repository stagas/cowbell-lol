// credits: chat-gpt
export function groupSort<T extends { id: string, title: string, updatedAt: string }>(input: T[]): T[][] {
  return input
    .sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .reduce((acc, curr) => {
      const group = acc.find(g => g[0].title === curr.title);
      if (group) {
        group.push(curr);
      } else {
        acc.push([curr]);
      }
      return acc;
    }, [] as T[][])
}
