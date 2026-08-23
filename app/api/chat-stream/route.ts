import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";
import { requestProvider } from "../common";
import { PLATFORMS } from "../../client/platforms";

async function createStream(req: NextRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const { res, provider } = await requestProvider(req);
  const parseDelta = (PLATFORMS[provider] ?? PLATFORMS.openai).parseDelta;

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("stream")) {
    const content = await (
      await res.text()
    ).replace(/provided:.*. You/, "provided: ***. You");
    console.log("[Stream] error ", content);
    return "```json\n" + content + "```";
  }

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const close = () => {
        if (!closed) {
          closed = true;
          controller.close();
        }
      };

      function onParse(event: any) {
        if (event.type === "event") {
          try {
            const { text, done } = parseDelta(event.data);
            if (done) {
              close();
              return;
            }
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        if (closed) break;
        parser.feed(decoder.decode(chunk, { stream: true }));
      }
      // Anthropic (message_stop) and OpenAI ([DONE]) close explicitly above;
      // Google's stream simply ends, so close here as a fallback.
      close();
    },
  });
  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const stream = await createStream(req);
    return new Response(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join(""),
    );
  }
}

export const runtime = "edge";
