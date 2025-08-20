import { useMemo } from "react";
import { useConnectorClient } from "wagmi";
import { type Config } from "wagmi";
import { walletClientToSigner } from "../adapters/ethers";

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });

  return useMemo(() => {
    if (!client) return undefined;
    return walletClientToSigner(client as any);
  }, [client]);
}
