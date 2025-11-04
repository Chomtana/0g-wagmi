/**
 * Contract addresses configuration for different networks
 */

export interface ContractAddresses {
  inft?: string;
}

export const contractAddresses: Record<number, ContractAddresses> = {
  // 0G Testnet
  16600: {
    inft: process.env.VITE_INFT_CONTRACT_ADDRESS || undefined,
  },
  // Local network
  31337: {
    inft: undefined,
  },
};

/**
 * Get contract address for a specific chain
 */
export function getContractAddress(
  chainId: number | undefined,
  contract: keyof ContractAddresses
): string | undefined {
  if (!chainId) return undefined;
  return contractAddresses[chainId]?.[contract];
}

/**
 * Default contract address (can be overridden by hook params)
 */
export const DEFAULT_INFT_CONTRACT_ADDRESS = contractAddresses[16600]?.inft;
