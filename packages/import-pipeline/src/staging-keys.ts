export function stagedRecordKeyForSourceRow(input: {
  sourceFileId: string;
  rowIndex: number;
}): string {
  assertPositiveRowIndex(input.rowIndex);
  return `source-file:${input.sourceFileId}:row:${input.rowIndex}`;
}

export function sourceRowKeyForIndex(rowIndex: number): string {
  assertPositiveRowIndex(rowIndex);
  return `row:${rowIndex}`;
}

function assertPositiveRowIndex(rowIndex: number): void {
  if (!Number.isInteger(rowIndex) || rowIndex < 1) {
    throw new Error("Row index must be a positive integer.");
  }
}
