export type JsonParsedRecord = {
  key: string;
  value: unknown;
  sourcePath: string;
};

export type JsonStagedRecord = JsonParsedRecord & {
  normalizedKey: string;
  valueType: string;
};

export type JsonCommittedRecord = JsonStagedRecord & {
  committedAt: string;
  commitKey: string;
};
