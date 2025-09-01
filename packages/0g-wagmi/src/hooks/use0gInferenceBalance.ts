import { useQuery } from "@tanstack/react-query";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";
import { formatEther } from "viem";

export interface Use0gInferenceBalanceParams {
  chainId?: number;
  enabled?: boolean;
  refetchInterval?: number | false;
}

export interface LedgerInferenceAccount {
  balance: bigint;
  availableBalance: bigint;
  pendingRefund: bigint;
}

export function use0gInferenceBalance(
  providerAddress: string,
  {
    chainId,
    enabled = true,
    refetchInterval = 30000, // 30 seconds default
  }: Use0gInferenceBalanceParams = {}
) {
  const signer = useEthersSigner({ chainId });

  const query = useQuery({
    queryKey: [
      "0g-inference-balance",
      providerAddress,
      chainId,
      signer?.address,
    ],
    queryFn: async (): Promise<LedgerInferenceAccount> => {
      if (!signer) {
        return {
          balance: BigInt(0),
          availableBalance: BigInt(0),
          pendingRefund: BigInt(0),
        };
      }

      try {
        const broker = await createZGComputeNetworkBroker(signer);
        const account = await broker.inference.getAccount(providerAddress);

        const balance = account.balance;
        const availableBalance = account.balance - account.pendingRefund;
        const pendingRefund = account.pendingRefund;

        return {
          balance: BigInt(balance),
          availableBalance: BigInt(availableBalance),
          pendingRefund: BigInt(pendingRefund),
        };
      } catch (error: any) {
        if (error.message.includes("Account does not exist")) {
          return {
            balance: BigInt(0),
            availableBalance: BigInt(0),
            pendingRefund: BigInt(0),
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
