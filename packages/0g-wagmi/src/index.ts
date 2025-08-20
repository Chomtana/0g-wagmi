export { use0gAddFunds, type Use0gAddFundsParams } from './hooks/use0gAddFunds'
export { use0gBalance, type Use0gBalanceParams, type LedgerAccount } from './hooks/use0gBalance'
export { use0gBroker } from './hooks/use0gBroker'
export { useEthersSigner } from './hooks/useEthersSigner'
export { walletClientToSigner, publicClientToProvider } from './adapters/ethers'

export const ZG_TESTNET_CONFIG = {
  rpcUrl: 'https://evmrpc-testnet.0g.ai',
  chainId: 16600,
  chainName: '0G Testnet',
  nativeCurrency: {
    name: '0G',
    symbol: 'OG',
    decimals: 18,
  },
  blockExplorerUrl: 'https://testnet.0g.ai',
} as const