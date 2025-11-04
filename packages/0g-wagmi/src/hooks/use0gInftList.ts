import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export interface InftToken {
  tokenId: string;
  metadataHash: string;
  owner: string;
  mintedAt: number;
  txHash?: string;
}

export interface Use0gInftListParams {
  chainId?: number;
  contractAddress?: string;
  enabled?: boolean;
}

const STORAGE_KEY = "0g-inft-tokens";

/**
 * Gets all iNFTs owned by an address
 * In production, this should query the blockchain via contract events or subgraph
 * For demo purposes, we use localStorage
 */
function getInftsFromStorage(ownerAddress?: string): InftToken[] {
  if (!ownerAddress) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const allTokens: InftToken[] = JSON.parse(stored);
    return allTokens.filter(
      (token) => token.owner.toLowerCase() === ownerAddress.toLowerCase()
    );
  } catch (error) {
    console.error("Error reading iNFT tokens from storage:", error);
    return [];
  }
}

/**
 * Saves an iNFT to storage
 */
export function saveInftToStorage(token: InftToken): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allTokens: InftToken[] = stored ? JSON.parse(stored) : [];

    // Check if token already exists
    const existingIndex = allTokens.findIndex((t) => t.tokenId === token.tokenId);

    if (existingIndex >= 0) {
      allTokens[existingIndex] = token;
    } else {
      allTokens.push(token);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens));
  } catch (error) {
    console.error("Error saving iNFT token to storage:", error);
  }
}

/**
 * Hook to list all iNFTs owned by the connected wallet
 */
export function use0gInftList({
  chainId,
  contractAddress,
  enabled = true,
}: Use0gInftListParams = {}) {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["0g-inft-list", address, chainId, contractAddress],
    queryFn: () => getInftsFromStorage(address),
    enabled: enabled && !!address,
    staleTime: 30000, // 30 seconds
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["0g-inft-list", address, chainId, contractAddress] });
  };

  return {
    ...query,
    infts: query.data || [],
    refetch,
  };
}
