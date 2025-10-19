import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Indexer } from "@0glabs/0g-ts-sdk";

export interface Use0gStorageDownloadParams {
  indexerUrl?: string;
  onSuccess?: (data: { fileData: ArrayBuffer; fileName: string }) => void;
  onError?: (error: Error) => void;
}

export interface DownloadResult {
  fileData: ArrayBuffer;
  fileName: string;
}

/**
 * Downloads a file from 0G storage by root hash using direct API call
 * This is the preferred method for browser environments
 */
async function downloadByRootHashAPI(
  rootHash: string,
  storageRpc: string
): Promise<ArrayBuffer> {
  console.log(`API Download by root hash: ${rootHash} from ${storageRpc}`);

  if (!rootHash) {
    throw new Error("Root hash is required");
  }

  // Construct API URL
  const apiUrl = `${storageRpc}/file?root=${rootHash}`;
  console.log(`Downloading from API URL: ${apiUrl}`);

  // Fetch the file
  const response = await fetch(apiUrl);

  // Check if the response content type is JSON before proceeding
  const contentType = response.headers.get("content-type");
  const isJsonResponse = contentType && contentType.includes("application/json");

  // Handle JSON responses separately
  if (isJsonResponse) {
    const jsonData = await response.json();
    console.log("API returned JSON response:", jsonData);

    // If it's an error response
    if (!response.ok || jsonData.code) {
      console.log("API returned JSON error:", jsonData);

      // Handle specific error codes
      if (jsonData.code === 101) {
        // Format root hash to be more display-friendly
        const truncatedHash =
          rootHash.length > 20
            ? `${rootHash.substring(0, 10)}...${rootHash.substring(
                rootHash.length - 10
              )}`
            : rootHash;

        throw new Error(
          `File not found: The file with root hash "${truncatedHash}" does not exist in storage or may be on a different network mode`
        );
      }

      // For other JSON errors, use the message from the response
      throw new Error(
        `Download failed: ${jsonData.message || "Unknown error"}`
      );
    }
  }

  // Handle non-JSON responses
  if (!response.ok) {
    const errorText = await response.text();
    console.log(`API error (${response.status}): ${errorText}`);
    throw new Error(
      `Download failed with status ${response.status}: ${errorText}`
    );
  }

  // Get file data as ArrayBuffer
  const fileData = await response.arrayBuffer();

  if (!fileData || fileData.byteLength === 0) {
    throw new Error("Downloaded file is empty");
  }

  console.log(
    `API Download successful, received ${fileData.byteLength} bytes`
  );
  return fileData;
}

/**
 * Creates a downloadable file from raw file data
 */
function downloadBlobAsFile(fileData: ArrayBuffer, fileName: string): void {
  try {
    // Validate file data
    if (!fileData) {
      throw new Error("File data is null or undefined");
    }

    if (!(fileData instanceof ArrayBuffer)) {
      throw new Error(`Invalid file data type: ${typeof fileData}`);
    }

    if (fileData.byteLength === 0) {
      throw new Error("File data is empty");
    }

    // Create a blob from the array buffer
    const byteArray = new Uint8Array(fileData);
    const blob = new Blob([byteArray]);
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `download-${Date.now()}.bin`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`File download triggered: ${fileName}`);
  } catch (error) {
    console.error("Error in downloadBlobAsFile:", error);
    throw error;
  }
}

export function use0gStorageDownload({
  indexerUrl = "https://indexer-storage-testnet-turbo.0g.ai",
  onSuccess,
  onError,
}: Use0gStorageDownloadParams = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      rootHash,
      fileName,
    }: {
      rootHash: string;
      fileName?: string;
    }): Promise<DownloadResult> => {
      setIsLoading(true);

      try {
        // Download file using API method (preferred for browser)
        const fileData = await downloadByRootHashAPI(rootHash, indexerUrl);

        // Prepare file name
        const downloadFileName =
          fileName || `file-${rootHash.substring(0, 10)}.bin`;

        return {
          fileData,
          fileName: downloadFileName,
        };
      } catch (error: any) {
        throw error instanceof Error ? error : new Error(String(error));
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data: DownloadResult) => {
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

  const download = useCallback(
    async (rootHash: string, fileName?: string) => {
      return mutation.mutateAsync({ rootHash, fileName });
    },
    [mutation]
  );

  const downloadAndSave = useCallback(
    async (rootHash: string, fileName?: string) => {
      const result = await mutation.mutateAsync({ rootHash, fileName });
      downloadBlobAsFile(result.fileData, result.fileName);
      return result;
    },
    [mutation]
  );

  return {
    download,
    downloadAndSave,
    isLoading: isLoading || mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
