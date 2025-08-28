import { useQuery } from "@tanstack/react-query";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export interface Use0gBalanceParams {
  chainId?: number;
  enabled?: boolean;
  refetchInterval?: number | false;
}

export interface LedgerAccount {
  totalBalance: bigint;
  availableBalance: bigint;
}

export function use0gBalance({
  chainId,
  enabled = true,
  refetchInterval = 30000, // 30 seconds default
}: Use0gBalanceParams = {}) {
  const signer = useEthersSigner({ chainId });

  const query = useQuery({
    queryKey: ["0g-balance", chainId, signer?.address],
    queryFn: async (): Promise<LedgerAccount> => {
      if (!signer) {
        return {
          totalBalance: BigInt(0),
          availableBalance: BigInt(0),
        };
      }

      try {
        const broker = await createZGComputeNetworkBroker(signer);
        const account = await broker.ledger.getLedger();

        const totalBalance = account.totalBalance?.toString() || "0";
        const availableBalance = account.availableBalance?.toString() || "0";

        return {
          totalBalance: BigInt(totalBalance),
          availableBalance: BigInt(availableBalance),
        };
      } catch (error: any) {
        if (error.message.includes("Account does not exist")) {
          return {
            totalBalance: BigInt(0),
            availableBalance: BigInt(0),
          };
        }

        throw error;
      }
    },
    enabled: enabled && !!signer,
    refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    balance: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
