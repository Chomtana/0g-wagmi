import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export interface Use0gWithdrawFundsParams {
  chainId?: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function use0gWithdrawFunds({
  chainId,
  onSuccess,
  onError,
}: Use0gWithdrawFundsParams = {}) {
  const signer = useEthersSigner({ chainId });
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!signer) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);

      try {
        const broker = await createZGComputeNetworkBroker(signer);
        await broker.ledger.getLedger();
        await broker.ledger.refund(parseFloat(amount));
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data: any) => {
      if (onSuccess && data?.hash) {
        onSuccess(data.hash);
      }
    },
    onError: (error: Error) => {
      setIsLoading(false);
      if (onError) {
        onError(error);
      }
    },
  });

  const withdrawFunds = useCallback(
    async (amount: string) => {
      return mutation.mutateAsync(amount);
    },
    [mutation]
  );

  return {
    withdrawFunds,
    isLoading: isLoading || mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
