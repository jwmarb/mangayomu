export function toPascalCase(input: string) {
  return input
    .trim()
    .split(/\s|-|_/g)
    .map((x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase())
    .join(' ')
    .trim();
}
