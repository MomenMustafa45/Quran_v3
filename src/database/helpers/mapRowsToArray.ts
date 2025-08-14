export function mapRowsToArray<T = any>(rows: {
  length: number;
  item: (index: number) => any;
}): T[] {
  const result: T[] = [];
  for (let i = 0; i < rows.length; i++) {
    result.push(rows.item(i));
  }
  return result;
}
