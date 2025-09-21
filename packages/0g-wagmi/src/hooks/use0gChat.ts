import { useState, useCallback } from "react";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export type ChatMessage = {
  role: string; // "system" | "developer" | "user" | "assistant" | "tool" | "function"
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | {
            type: "image_url";
            image_url:
              | string
              | { url: string; detail?: "low" | "high" | "auto" };
          }
      >;
  name?: string;
  tool_call_id?: string; // only for tool replies
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
};

export interface Use0gChatReturn {
  chat: (
    question: string,
    onMessage?: (message: string) => any
  ) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function use0gChat(providerAddress: string): Use0gChatReturn {
  const signer = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(
    async (
      question: string | ChatMessage[],
      onMessage?: (message: string) => any
    ): Promise<string> => {
      if (!signer) {
        throw new Error("No signer available. Please connect your wallet.");
      }

      setIsLoading(true);
      setError(null);

      try {
        // Initialize broker
        const broker = await createZGComputeNetworkBroker(signer);

        // Acknowledge provider
        await broker.inference.acknowledgeProviderSigner(providerAddress);

        // Get service metadata and headers
        const { endpoint, model } = await broker.inference.getServiceMetadata(
          providerAddress
        );

        // Prepare messages
        const messages: ChatMessage[] =
          typeof question === "string"
            ? [{ role: "user", content: question }]
            : question;

        const headers = await broker.inference.getRequestHeaders(
          providerAddress,
          JSON.stringify(messages)
        );

        // Send request to the service
        const response = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            messages,
            model: model,
            stream: Boolean(onMessage),
          }),
        });

        if (!response.ok || !response.body) {
          const detail = await response.text().catch(() => "");
          throw new Error(`0g error ${response.status}: ${detail}`);
        }

        if (onMessage) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let full = "";

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // Generic SSE parse
            let j;
            while ((j = buffer.indexOf("\n\n")) !== -1) {
              const frame = buffer.slice(0, j);
              buffer = buffer.slice(j + 2);

              for (const line of frame.split("\n")) {
                if (!line.startsWith("data:")) continue;
                const payload = line.slice(5).trim();
                if (payload === "[DONE]") {
                  onMessage(full);
                  return full;
                }
                try {
                  // The Responses stream includes events that carry text deltas.
                  // We defensively check a few common shapes.
                  const evt = JSON.parse(payload) as any;
                  const token =
                    evt.delta?.output_text ??
                    evt.output_text?.delta ??
                    evt.text ??
                    "";

                  if (token) {
                    full += token;
                    onMessage(full);
                  }
                } catch {
                  // ignore
                }
              }
            }
          }

          return full;
        } else {
          const data = await response.json();

          if (!response.ok) {
            // Check if the response contains an error message
            const errorMessage =
              data?.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
          }
          const content = data.choices?.[0]?.message?.content || "";

          return content;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [signer, providerAddress]
  );

  return {
    chat,
    isLoading,
    error,
  };
}
