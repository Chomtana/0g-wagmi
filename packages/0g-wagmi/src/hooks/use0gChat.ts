import { useState, useCallback } from "react";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export interface Use0gChatReturn {
  chat: (question: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function use0gChat(providerAddress: string): Use0gChatReturn {
  const signer = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(
    async (question: string): Promise<string> => {
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
        const headers = await broker.inference.getRequestHeaders(
          providerAddress,
          question
        );

        // Send request to the service
        const response = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: question }],
            model: model,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        // Process and validate response
        const valid = await broker.inference.processResponse(
          providerAddress,
          content
        );

        if (!valid) {
          throw new Error("Invalid response from provider");
        }

        return content;
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
