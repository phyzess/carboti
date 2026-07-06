export type ExampleParsedRecord = {
  label: string;
  value: number;
};

export type ExampleStagedRecord = ExampleParsedRecord & {
  normalizedLabel: string;
};

export type ExampleCommittedRecord = ExampleStagedRecord & {
  committedAt: string;
};
