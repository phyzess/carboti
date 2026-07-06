export type StarterJsonParsedRecord = {
  key: string;
  value: unknown;
  sourcePath: string;
};

export type StarterJsonStagedRecord = StarterJsonParsedRecord & {
  normalizedKey: string;
  valueType: string;
};

export type StarterJsonCommittedRecord = StarterJsonStagedRecord & {
  committedAt: string;
  commitKey: string;
};
