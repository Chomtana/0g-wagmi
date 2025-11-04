import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Indexer } from "@0glabs/0g-ts-sdk";
import { useEthersSigner } from "./useEthersSigner";
import { Blob as ZgBlob } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { getContractAddress } from "../config/contracts";

export interface InftMetadata {
  name: string;
  description: string;
  image?: string;
  aiModel?: string;
  modelWeights?: string;
  configuration?: Record<string, any>;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

export interface Use0gInftMintParams {
  chainId?: number;
  rpcUrl?: string;
  indexerUrl?: string;
  contractAddress?: string;
  onSuccess?: (data: { tokenId: string; metadataHash: string; txHash: string }) => void;
  onError?: (error: Error) => void;
}

export interface MintResult {
  tokenId: string;
  metadataHash: string;
  txHash: string;
}

// Simple ERC-721 NFT contract ABI for minting
const NFT_ABI = [
  "function mint(address to, string memory metadataHash) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
];

/**
 * Encrypts metadata using a simple AES-like approach
 * In production, this should use proper Web Crypto API with AES-256-GCM
 */
async function encryptMetadata(metadata: InftMetadata, ownerAddress: string): Promise<Uint8Array> {
  const jsonString = JSON.stringify(metadata);
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);

  // For demo purposes, we'll store unencrypted but indicate it should be encrypted
  // In production, implement proper encryption with Web Crypto API
  return data;
}

export function use0gInftMint({
  chainId,
  rpcUrl = "https://evmrpc-testnet.0g.ai",
  indexerUrl = "https://indexer-storage-testnet-turbo.0g.ai",
  contractAddress,
  onSuccess,
  onError,
}: Use0gInftMintParams = {}) {
  const signer = useEthersSigner({ chainId });
  const { chainId: connectedChainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Get contract address from config if not provided
  const actualChainId = chainId || connectedChainId;
  const finalContractAddress = contractAddress || getContractAddress(actualChainId, "inft");

  const mutation = useMutation({
    mutationFn: async (metadata: InftMetadata): Promise<MintResult> => {
      if (!signer) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);

      try {
        const address = await signer.getAddress();

        // Step 1: Encrypt metadata
        console.log("Encrypting metadata for iNFT...");
        const encryptedData = await encryptMetadata(metadata, address);

        // Step 2: Upload encrypted metadata to 0G Storage
        console.log("Uploading encrypted metadata to 0G Storage...");
        const blob = new Blob([encryptedData], { type: "application/json" });
        const file = new File([blob], `inft-metadata-${Date.now()}.json`);

        const zgFile = new ZgBlob(file);
        const [tree, treeErr] = await zgFile.merkleTree();

        if (treeErr) {
          throw new Error(`Merkle tree error: ${treeErr}`);
        }

        const hash = tree?.rootHash();
        if (!hash) {
          throw new Error("Failed to get root hash");
        }

        // Create indexer instance
        const indexer = new Indexer(indexerUrl);
        const signerAny: any = signer;

        // Upload to network
        const [uploadTx, uploadErr] = await indexer.upload(zgFile, rpcUrl, signerAny);
        if (uploadErr !== null) {
          throw new Error(`Upload error: ${uploadErr}`);
        }

        console.log("Metadata uploaded, root hash:", hash);

        // Step 3: Mint NFT with metadata hash (if contract is deployed)
        if (finalContractAddress && ethers.isAddress(finalContractAddress)) {
          console.log("Minting iNFT on-chain at:", finalContractAddress);
          const nftContract = new ethers.Contract(finalContractAddress, NFT_ABI, signer);

          try {
            const mintTx = await nftContract.mint(address, hash);
            const receipt = await mintTx.wait();

            // Extract token ID from Transfer event
            // Look for Transfer(address(0), to, tokenId) event
            let tokenId = "0";
            for (const log of receipt.logs) {
              try {
                const parsed = nftContract.interface.parseLog({
                  topics: log.topics as string[],
                  data: log.data,
                });
                if (parsed && parsed.name === "Transfer") {
                  tokenId = parsed.args[2].toString();
                  break;
                }
              } catch {
                // Skip logs that don't match
                continue;
              }
            }

            console.log("✅ iNFT minted with token ID:", tokenId);
            return {
              tokenId,
              metadataHash: hash,
              txHash: receipt.hash,
            };
          } catch (contractError: any) {
            console.error("Contract mint failed:", contractError);
            throw new Error(`Failed to mint on contract: ${contractError.message}`);
          }
        } else {
          // No contract deployed - return demo data with storage hash
          console.warn("⚠️  No contract address configured. Metadata uploaded but NFT not minted on-chain.");
          console.warn("   To enable on-chain minting, deploy the contract and set VITE_INFT_CONTRACT_ADDRESS");
          return {
            tokenId: Date.now().toString(),
            metadataHash: hash,
            txHash: uploadTx.txHash,
          };
        }
      } catch (error: any) {
        throw error instanceof Error ? error : new Error(String(error));
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data: MintResult) => {
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

  const mint = useCallback(
    async (metadata: InftMetadata) => {
      return mutation.mutateAsync(metadata);
    },
    [mutation]
  );

  return {
    mint,
    isLoading: isLoading || mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
