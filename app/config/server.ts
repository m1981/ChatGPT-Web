import md5 from "spark-md5";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      ANTHROPIC_BASE_URL?: string;
      GEMINI_API_KEY?: string;
      GEMINI_BASE_URL?: string;
      CODE?: string;
      PROXY_URL?: string;
      VERCEL?: string;
    }
  }
}

const DEFAULT_ANTHROPIC_BASE_URL = "https://api.anthropic.com";
const DEFAULT_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com";

const ACCESS_CODES = (function getAccessCodes(): Set<string> {
  const code = process.env.CODE;

  try {
    const codes = (code?.split(",") ?? [])
      .filter((v) => !!v)
      .map((v) => md5.hash(v.trim()));
    return new Set(codes);
  } catch (e) {
    return new Set();
  }
})();

export const getServerSideConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicBaseUrl:
      process.env.ANTHROPIC_BASE_URL ?? DEFAULT_ANTHROPIC_BASE_URL,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiBaseUrl: process.env.GEMINI_BASE_URL ?? DEFAULT_GEMINI_BASE_URL,
    code: process.env.CODE,
    codes: ACCESS_CODES,
    needCode: ACCESS_CODES.size > 0,
    proxyUrl: process.env.PROXY_URL,
    isVercel: !!process.env.VERCEL,
  };
};
