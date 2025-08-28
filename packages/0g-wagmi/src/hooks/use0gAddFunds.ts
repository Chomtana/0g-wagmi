import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";
import { useEthersSigner } from "./useEthersSigner";

export interface Use0gAddFundsParams {
  chainId?: number;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function use0gAddFunds({
  chainId,
  onSuccess,
  onError,
}: Use0gAddFundsParams = {}) {
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
        await broker.ledger.depositFund(parseFloat(amount));
      } catch (error: any) {
        if (error.message.includes("Account does not exist")) {
          const broker = await createZGComputeNetworkBroker(signer);
          await broker.ledger.addLedger(parseFloat(amount));
        }

        throw error;
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

  const addFunds = useCallback(
    async (amount: string) => {
      return mutation.mutateAsync(amount);
    },
    [mutation]
  );

  return {
    addFunds,
    isLoading: isLoading || mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
