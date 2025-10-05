import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Indexer } from "@0glabs/0g-ts-sdk";
import { useEthersSigner } from "./useEthersSigner";
import { Blob as ZgBlob } from "@0glabs/0g-ts-sdk";

export interface Use0gStorageUploadParams {
  chainId?: number;
  rpcUrl?: string;
  indexerUrl?: string;
  onSuccess?: (data: { rootHash: string; txHash: string }) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  rootHash: string;
  txHash: string;
}

export function use0gStorageUpload({
  chainId,
  rpcUrl = "https://evmrpc-testnet.0g.ai",
  indexerUrl = "https://indexer-storage-testnet-turbo.0g.ai",
  onSuccess,
  onError,
}: Use0gStorageUploadParams = {}) {
  const signer = useEthersSigner({ chainId });
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (blob: File): Promise<UploadResult> => {
      if (!signer) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);

      try {
        // Create 0G file object
        const file = new ZgBlob(blob);
        const [tree, err] = await file.merkleTree();

        if (err) {
          throw new Error(`Merkle tree error: ${err}`);
        }

        const hash = tree?.rootHash();
        if (!hash) {
          throw new Error("Failed to get root hash");
        }

        // Create indexer instance
        const indexer = new Indexer(indexerUrl);

        const signerAny: any = signer;

        // Upload to network
        const [tx, uploadErr] = await indexer.upload(file, rpcUrl, signerAny);
        if (uploadErr !== null) {
          throw new Error(`Upload error: ${uploadErr}`);
        }

        return tx;
      } catch (error: any) {
        throw error instanceof Error ? error : new Error(String(error));
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data: UploadResult) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: Error) => {
      setIsLoading(false);
      if (onError) {
        onError(error);
      }
    },
  });

  const upload = useCallback(
    async (blob: File) => {
      return mutation.mutateAsync(blob);
    },
    [mutation]
  );

  return {
    upload,
    isLoading: isLoading || mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
