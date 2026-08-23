import type { Platform, PlatformRequestOptions, ParsedDelta } from "./types";

const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

function buildRequest(opts: PlatformRequestOptions) {
  const { messages = [], model, temperature, max_tokens } = opts.body ?? {};

  const system: string[] = [];
  const anthropicMessages = messages
    .filter((m: any) => {
      if (m.role === "system") {
        system.push(m.content ?? "");
        return false;
      }
      return true;
    })
    .map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content ?? "",
    }));

  const payload: Record<string, any> = {
    model,
    // Anthropic requires max_tokens; the client omits it from the outgoing body.
    max_tokens: max_tokens || DEFAULT_MAX_TOKENS,
    messages: anthropicMessages,
    stream: true,
  };

  if (system.length) {
    payload.system = system.join("\n\n");
  }

  if (typeof temperature === "number") {
    payload.temperature = temperature;
  }

  const baseUrl = opts.baseUrl.replace(/\/$/, "");

  return {
    url: `${baseUrl}/v1/messages`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": opts.apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(payload),
    },
  };
}

function parseDelta(eventData: string): ParsedDelta {
  const json = JSON.parse(eventData);

  if (
    json.type === "content_block_delta" &&
    json.delta?.type === "text_delta"
  ) {
    return { text: json.delta.text };
  }

  if (json.type === "message_stop") {
    return { done: true };
  }

  return {};
}

export const anthropicPlatform: Platform = { buildRequest, parseDelta };
