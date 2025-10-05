import { useEffect, useState } from "react";
import { Blob as ZgBlob } from "@0glabs/0g-ts-sdk";

export interface Use0gStorageFileResult {
  file: ZgBlob | null;
  rootHash: string | null;
  error: Error | null;
  isLoading: boolean;
}

export function use0gStorageFile(blob: File | null): Use0gStorageFileResult {
  const [result, setResult] = useState<Use0gStorageFileResult>({
    file: null,
    rootHash: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!blob) {
      setResult({
        file: null,
        rootHash: null,
        error: null,
        isLoading: false,
      });
      return;
    }

    let cancelled = false;

    const createFile = async () => {
      setResult((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Create 0G file object
        const file = new ZgBlob(blob);
        const [tree, err] = await file.merkleTree();

        if (cancelled) return;

        if (err) {
          throw new Error(`Merkle tree error: ${err}`);
        }

        const rootHash = tree?.rootHash() || null;

        setResult({
          file,
          rootHash,
          error: null,
          isLoading: false,
        });
      } catch (error: any) {
        if (cancelled) return;

        const err = error instanceof Error ? error : new Error(String(error));
        setResult({
          file: null,
          rootHash: null,
          error: err,
          isLoading: false,
        });
      }
    };

    createFile();

    return () => {
      cancelled = true;
    };
  }, [blob]);

  return result;
}
