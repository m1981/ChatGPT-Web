import type { Platform, PlatformRequestOptions, ParsedDelta } from "./types";

function buildRequest(opts: PlatformRequestOptions) {
  let baseUrl = opts.baseUrl;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  return {
    url: `${baseUrl}/${opts.path ?? "v1/chat/completions"}`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
        ...(opts.orgId && { "OpenAI-Organization": opts.orgId }),
      },
      body: JSON.stringify(opts.body),
    },
  };
}

function parseDelta(eventData: string): ParsedDelta {
  if (eventData === "[DONE]") {
    return { done: true };
  }

  const json = JSON.parse(eventData);
  return { text: json.choices?.[0]?.delta?.content ?? undefined };
}

export const openaiPlatform: Platform = { buildRequest, parseDelta };
