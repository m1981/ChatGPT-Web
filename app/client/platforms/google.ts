import type { Platform, PlatformRequestOptions, ParsedDelta } from "./types";

function buildRequest(opts: PlatformRequestOptions) {
  const { messages = [], model, temperature, max_tokens } = opts.body ?? {};

  const system: string[] = [];
  const contents = messages
    .filter((m: any) => {
      if (m.role === "system") {
        system.push(m.content ?? "");
        return false;
      }
      return true;
    })
    .map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content ?? "" }],
    }));

  const payload: Record<string, any> = { contents };

  if (system.length) {
    payload.systemInstruction = { parts: [{ text: system.join("\n\n") }] };
  }

  const generationConfig: Record<string, any> = {};
  if (typeof temperature === "number") {
    generationConfig.temperature = temperature;
  }
  if (typeof max_tokens === "number") {
    generationConfig.maxOutputTokens = max_tokens;
  }
  if (Object.keys(generationConfig).length) {
    payload.generationConfig = generationConfig;
  }

  const baseUrl = opts.baseUrl.replace(/\/$/, "");

  return {
    // alt=sse gives a true SSE stream, so the edge route can reuse the same
    // eventsource-parser pipeline used for OpenAI/Anthropic instead of a
    // separate JSON-array streaming parser.
    url: `${baseUrl}/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${opts.apiKey}`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  };
}

function parseDelta(eventData: string): ParsedDelta {
  const json = JSON.parse(eventData);
  const text = json.candidates?.[0]?.content?.parts
    ?.map((p: any) => p.text ?? "")
    .join("");

  return { text: text || undefined };
}

export const googlePlatform: Platform = { buildRequest, parseDelta };
