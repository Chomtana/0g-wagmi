import { useQuery } from "@tanstack/react-query";
import { useEthersSigner } from "./useEthersSigner";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";

export interface ServiceMetadata {
  endpoint: string;
  model: string;
}

export function use0gServiceMetadata(providerAddress: string) {
  const signer = useEthersSigner();

  const {
    data: metadata,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["0g-service-metadata", providerAddress, signer?.address],
    queryFn: async (): Promise<ServiceMetadata> => {
      if (!signer) throw new Error("Signer not available");

      const broker = await createZGComputeNetworkBroker(signer);
      await broker.inference.acknowledgeProviderSigner(providerAddress);

      const metadata = await broker.inference.getServiceMetadata(providerAddress);
      return metadata;
    },
    enabled: !!signer && !!providerAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    metadata,
    modelName: metadata?.model,
    endpoint: metadata?.endpoint,
    isLoading,
    isError,
    error,
    refetch,
  };
}
