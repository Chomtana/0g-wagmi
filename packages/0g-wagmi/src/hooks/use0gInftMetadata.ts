import { useQuery } from "@tanstack/react-query";
import { Indexer } from "@0glabs/0g-ts-sdk";
import { InftMetadata } from "./use0gInftMint";

export interface Use0gInftMetadataParams {
  metadataHash?: string;
  indexerUrl?: string;
  enabled?: boolean;
}

/**
 * Decrypts metadata (simplified for demo)
 * In production, this should use proper Web Crypto API with sealed key decryption
 */
async function decryptMetadata(encryptedData: ArrayBuffer): Promise<InftMetadata> {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(encryptedData);
  return JSON.parse(jsonString);
}

/**
 * Downloads and decrypts iNFT metadata from 0G Storage
 */
async function fetchInftMetadata(
  metadataHash: string,
  indexerUrl: string
): Promise<InftMetadata> {
  if (!metadataHash) {
    throw new Error("Metadata hash is required");
  }

  console.log(`Fetching iNFT metadata: ${metadataHash}`);

  // Download from 0G Storage
  const apiUrl = `${indexerUrl}/file?root=${metadataHash}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const isJsonResponse = contentType && contentType.includes("application/json");

    if (isJsonResponse) {
      const jsonData = await response.json();
      if (jsonData.code === 101) {
        throw new Error(`Metadata not found for hash: ${metadataHash}`);
      }
      throw new Error(`Failed to fetch metadata: ${jsonData.message || "Unknown error"}`);
    }

    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }

  // Get encrypted data
  const encryptedData = await response.arrayBuffer();

  // Decrypt and parse metadata
  const metadata = await decryptMetadata(encryptedData);

  return metadata;
}

export function use0gInftMetadata({
  metadataHash,
  indexerUrl = "https://indexer-storage-testnet-turbo.0g.ai",
  enabled = true,
}: Use0gInftMetadataParams) {
  return useQuery({
    queryKey: ["0g-inft-metadata", metadataHash, indexerUrl],
    queryFn: () => {
      if (!metadataHash) {
        throw new Error("Metadata hash is required");
      }
      return fetchInftMetadata(metadataHash, indexerUrl);
    },
    enabled: enabled && !!metadataHash,
    staleTime: 60000, // 1 minute
    retry: 2,
  });
}
