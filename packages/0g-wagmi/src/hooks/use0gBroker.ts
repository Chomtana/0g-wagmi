import { useMemo } from "react";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export function use0gBroker({ chainId }: { chainId?: number } = {}) {
  const signer = useEthersSigner({ chainId });

  const broker = useMemo(async () => {
    if (!signer) return null;
    try {
      return await createZGComputeNetworkBroker(signer);
    } catch (error) {
      console.error("Failed to create 0G broker:", error);
      return null;
    }
  }, [signer]);

  return broker;
}
