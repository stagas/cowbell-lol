export function allWidth(value: string) {
  return /*css*/`
    width: ${value};
    min-width: ${value};
    max-width: ${value};
  `;
}
