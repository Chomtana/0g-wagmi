import { useQuery } from "@tanstack/react-query";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

/**
 * use0gBroker
 *
 * Returns a broker instance for interacting with the 0G compute network.
 * Uses react-query to manage async broker creation and loading state.
 *
 * @param {Object} params
 * @param {number} [params.chainId] - Optional chain ID for the signer.
 * @returns {{
 *   broker: any | null,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 *   refetch: () => void
 * }}
 */
export function use0gBroker({ chainId }: { chainId?: number } = {}) {
  const signer = useEthersSigner({ chainId });

  const {
    data: broker,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["0g-broker", chainId, signer?.address],
    queryFn: async () => {
      if (!signer) return null;
      return await createZGComputeNetworkBroker(signer);
    },
    enabled: !!signer,
    retry: 3,
    staleTime: Infinity,
  });

  return {
    broker,
    isLoading,
    isError,
    error,
    refetch,
  };
}
