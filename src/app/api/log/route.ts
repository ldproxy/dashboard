import { type NextRequest } from "next/server";
import { IS_DEV, IS_MODE_SINGLE, USE_DEV_DATA } from "../../../lib/env";

export async function GET(req: NextRequest) {
  if (req.headers.get("accept") !== "text/event-stream") {
    return new Response("Expected 'text/event-stream'", { status: 400 });
  }

  //let backendUrl = "http://localhost:7081/api/logs/attach";

  let backendUrl;
  const apiUrls =
    IS_MODE_SINGLE && IS_DEV ? ["http://localhost:7081/api"] : ["/api"];

  if (USE_DEV_DATA && IS_MODE_SINGLE) {
    backendUrl = `/api/logs/attach?apiUrls=dev`;
  } else {
    backendUrl = `${apiUrls[0]}/logs/attach`;
  }

  if (!backendUrl || !IS_MODE_SINGLE) {
    return new Response("Failed to connect to SSE backend", { status: 500 });
  }

  const response = await fetch(backendUrl, {
    headers: {
      Accept: "text/event-stream",
    },
  });

  if (!response.ok) {
    return new Response("Failed to connect to SSE backend", { status: 500 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const reader = response.body?.getReader();

      const push = async () => {
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Error reading from SSE backend:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      };

      push();
    },
    cancel() {
      console.log("SSE connection closed");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  const logLevel = req.nextUrl.searchParams.get("logLevel");

  if (!IS_MODE_SINGLE) {
    return new Response("Failed to connect to SSE backend", { status: 500 });
  }

  if (
    !logLevel ||
    !["ERROR", "WARN", "INFO", "DEBUG", "TRACE"].includes(logLevel)
  ) {
    return new Response("Invalid log level", { status: 400 });
  }

  const apiUrls =
    IS_MODE_SINGLE && IS_DEV ? ["http://localhost:7081/api"] : ["/api"];

  if (apiUrls.length === 0) {
    return new Response("No API URLs available", { status: 500 });
  }
  // /api/logs/setLogLevel?logLevel=DEBUG
  const backendUrl = `${apiUrls[0]}/logs/setLogLevel?logLevel=${logLevel}`;

  const response = await fetch(backendUrl, {
    method: "POST",
  });

  if (!response.ok) {
    return new Response("Failed to set log level", { status: 500 });
  }

  return new Response("Log level set successfully", { status: 200 });
}
