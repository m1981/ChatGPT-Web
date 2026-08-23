import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import { PLATFORMS } from "../client/platforms";
import type { ModelProvider } from "../store/config";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;

// Server-side fallback base URL/key per provider, used when the client didn't
// supply its own BYOK key (middleware already injected the right key/provider).
function envForProvider(provider: ModelProvider) {
  const serverConfig = getServerSideConfig();

  switch (provider) {
    case "anthropic":
      return { baseUrl: serverConfig.anthropicBaseUrl };
    case "google":
      return { baseUrl: serverConfig.geminiBaseUrl };
    default:
      return {
        baseUrl: BASE_URL.startsWith("http")
          ? BASE_URL
          : `${PROTOCOL}://${BASE_URL}`,
      };
  }
}

export async function requestProvider(req: NextRequest) {
  const provider = (req.headers.get("provider") ?? "openai") as ModelProvider;
  const apiKey = req.headers.get("token") ?? "";
  const path = req.headers.get("path") ?? "v1/chat/completions";
  const body = await req.json();

  const { baseUrl } = envForProvider(provider);
  const platform = PLATFORMS[provider] ?? PLATFORMS.openai;
  const { url, init } = platform.buildRequest({
    body,
    apiKey,
    baseUrl,
    path,
    orgId: process.env.OPENAI_ORG_ID,
  });

  console.log("[Proxy] ", provider, url);

  const res = await fetch(url, init);
  return { res, provider };
}

export async function requestOpenai(req: NextRequest) {
  const apiKey = req.headers.get("token");
  const openaiPath = req.headers.get("path");

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  console.log("[Proxy] ", openaiPath);
  console.log("[Base Url]", baseUrl);

  if (process.env.OPENAI_ORG_ID) {
    console.log("[Org ID]", process.env.OPENAI_ORG_ID);
  }

  return fetch(`${baseUrl}/${openaiPath}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(process.env.OPENAI_ORG_ID && {
        "OpenAI-Organization": process.env.OPENAI_ORG_ID,
      }),
    },
    method: req.method,
    body: req.body,
  });
}
