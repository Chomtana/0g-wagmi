import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Batcher,
  Indexer,
  KvClient,
  type Value,
  FixedPriceFlow__factory,
} from "@0glabs/0g-ts-sdk";
import { useEthersSigner } from "./useEthersSigner";
import { ethers } from "ethers";

export interface Use0gKeyValueParams {
  streamId: string;
  chainId?: number;
  rpcUrl?: string;
  indexerUrl?: string;
  kvNodeUrl?: string;
  flowContractAddress?: string;
  onSetSuccess?: (result: { txHash: string; rootHash: string }) => void;
  onSetError?: (error: Error) => void;
}

export interface KeyValueData {
  [key: string]: string | null;
}

export function use0gKeyValue({
  streamId,
  chainId,
  rpcUrl = "https://evmrpc-testnet.0g.ai",
  indexerUrl = "https://indexer-storage-testnet-turbo.0g.ai",
  kvNodeUrl = "http://3.101.147.150:6789",
  flowContractAddress = "0x22E03a6A89B950F1c82ec5e74F8eCa321a105296",
  onSetSuccess,
  onSetError,
}: Use0gKeyValueParams) {
  const signer = useEthersSigner({ chainId });
  const [isSettingValue, setIsSettingValue] = useState(false);
  const [cachedValues, setCachedValues] = useState<KeyValueData>({});

  // Query hook for getting a specific key's value
  const createGetValueQuery = useCallback(
    (key: string) => {
      return useQuery({
        queryKey: ["0g-kv-value", streamId, key],
        queryFn: async (): Promise<string | null> => {
          try {
            const kvClient = new KvClient(kvNodeUrl);
            const keyBytes = Buffer.from(key, "utf-8");
            const valueObj = await kvClient.getValue(streamId, keyBytes);

            // Extract the data from Value object and decode from base64
            const valueString = valueObj
              ? Buffer.from(valueObj.data, "base64").toString("utf-8")
              : null;

            // Cache the value
            setCachedValues((prev) => ({ ...prev, [key]: valueString }));

            return valueString;
          } catch (error: any) {
            throw error instanceof Error ? error : new Error(String(error));
          }
        },
        enabled: !!streamId && !!key,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      });
    },
    [streamId, kvNodeUrl]
  );

  // Mutation hook for setting a key-value pair
  const setValueMutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }): Promise<{ txHash: string; rootHash: string }> => {
      if (!signer) {
        throw new Error("No wallet connected");
      }

      setIsSettingValue(true);

      try {
        // Create indexer and get nodes
        const indexer = new Indexer(indexerUrl);
        const [nodes, err] = await indexer.selectNodes(1);
        if (err !== null) {
          throw new Error(`Error selecting nodes: ${err}`);
        }

        // Create flow contract instance with the signer
        // The signer from wagmi already has a provider connected
        const flowContract = FixedPriceFlow__factory.connect(
          flowContractAddress,
          signer as any
        );

        // Create batcher
        const batcher = new Batcher(1, nodes, flowContract, rpcUrl);

        console.log("streamId", streamId);

        // Prepare key-value data
        const keyBytes = Uint8Array.from(Buffer.from(key, "utf-8"));
        const valueBytes = Uint8Array.from(Buffer.from(value, "utf-8"));
        batcher.streamDataBuilder.set(streamId, keyBytes, valueBytes);

        // Execute batch upload
        const [tx, batchErr] = await batcher.exec();
        if (batchErr !== null) {
          throw new Error(`Batch execution error: ${batchErr}`);
        }

        // Update cached value
        setCachedValues((prev) => ({ ...prev, [key]: value }));

        return tx;
      } catch (error: any) {
        throw error instanceof Error ? error : new Error(String(error));
      } finally {
        setIsSettingValue(false);
      }
    },
    onSuccess: (result: { txHash: string; rootHash: string }) => {
      if (onSetSuccess) {
        onSetSuccess(result);
      }
    },
    onError: (error: Error) => {
      setIsSettingValue(false);
      if (onSetError) {
        onSetError(error);
      }
    },
  });

  const setValue = useCallback(
    async (key: string, value: string) => {
      return setValueMutation.mutateAsync({ key, value });
    },
    [setValueMutation]
  );

  const getValue = useCallback(
    (key: string) => {
      return createGetValueQuery(key);
    },
    [createGetValueQuery]
  );

  return {
    setValue,
    getValue,
    cachedValues,
    isSettingValue: isSettingValue || setValueMutation.isPending,
    setSuccess: setValueMutation.isSuccess,
    setError: setValueMutation.error,
    setData: setValueMutation.data,
    resetSetMutation: setValueMutation.reset,
  };
}
