export interface PlatformRequestOptions {
  body: any;
  apiKey: string;
  baseUrl: string;
  // OpenAI-only: REST path (e.g. "v1/chat/completions") and org id.
  path?: string;
  orgId?: string;
}

export interface BuiltRequest {
  url: string;
  init: RequestInit;
}

export interface ParsedDelta {
  text?: string;
  done?: boolean;
}

export interface Platform {
  buildRequest(opts: PlatformRequestOptions): BuiltRequest;
  parseDelta(eventData: string): ParsedDelta;
}
