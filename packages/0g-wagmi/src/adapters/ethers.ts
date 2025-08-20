import { type WalletClient, type PublicClient, type Transport, type Chain, type Account } from 'viem'
import { BrowserProvider, JsonRpcSigner } from 'ethers'

export function walletClientToSigner(walletClient: WalletClient<Transport, Chain, Account>) {
  const { account, chain, transport } = walletClient
  
  if (!chain) {
    throw new Error('Chain is required for ethers signer adapter')
  }
  
  if (!account) {
    throw new Error('Account is required for ethers signer adapter')
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  
  return signer
}

export function publicClientToProvider(publicClient: PublicClient<Transport, Chain>) {
  const { chain, transport } = publicClient
  
  if (!chain) {
    throw new Error('Chain is required for ethers provider adapter')
  }

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  return new BrowserProvider(transport, network)
}