import type { RequestOptions } from "./mock-api-support";
import type { MockState } from "./mock-api-state";

export type MockRouteContext = {
  method: string;
  options: RequestOptions;
  segments: string[];
  state: MockState;
  url: URL;
};

export type MockRouteResponse = object | undefined;
export type MockRouteResult = Promise<MockRouteResponse>;
