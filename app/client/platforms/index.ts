import type { ModelProvider } from "../../store/config";
import { openaiPlatform } from "./openai";
import { anthropicPlatform } from "./anthropic";
import { googlePlatform } from "./google";
import type { Platform } from "./types";

export const PLATFORMS: Record<ModelProvider, Platform> = {
  openai: openaiPlatform,
  anthropic: anthropicPlatform,
  google: googlePlatform,
};

export type {
  Platform,
  ParsedDelta,
  PlatformRequestOptions,
  BuiltRequest,
} from "./types";
