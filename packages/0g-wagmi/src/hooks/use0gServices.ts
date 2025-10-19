import { useQuery } from "@tanstack/react-query";
import { use0gBroker } from "./use0gBroker";

export function use0gServices({ chainId }: { chainId?: number } = {}) {
  const {
    broker,
    isLoading: brokerLoading,
    isError: brokerError,
    error: brokerErrorObj,
  } = use0gBroker({ chainId });

  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["0g-services", chainId],
    queryFn: async () => {
      if (!broker) throw new Error("Broker not available");
      console.log(broker, "broker");
      console.log(await broker.inference.listService(), "list services");
      return await broker.inference.listService();
    },
    enabled: !!broker,
  });

  return {
    services,
    isLoading: isLoading || brokerLoading,
    isError: isError || brokerError,
    error: error ?? brokerErrorObj,
    refetch,
  };
}
