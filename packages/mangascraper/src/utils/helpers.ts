export function extractNumbers(n: string): number {
  return parseFloat(n.replace(/[^0-9.]/g, ''));
}
