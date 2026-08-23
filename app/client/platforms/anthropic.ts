import type { Platform, PlatformRequestOptions, ParsedDelta } from "./types";

const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MAX_TOKENS = 4096;

function buildRequest(opts: PlatformRequestOptions) {
  const { messages = [], model, max_tokens } = opts.body ?? {};

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

  // Anthropic requires a non-empty messages array starting with a user turn.
  if (anthropicMessages.length === 0) {
    anthropicMessages.push({ role: "user", content: "..." });
  } else if (anthropicMessages[0].role === "assistant") {
    anthropicMessages.unshift({ role: "user", content: "..." });
  }

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

  // Do not send temperature/top_p/top_k: current-generation Claude models
  // (Sonnet 5, Opus 5, etc.) run extended thinking adaptively by default,
  // and the API rejects sampling params with a 400 while thinking is active.

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
