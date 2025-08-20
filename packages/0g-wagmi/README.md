# 0g-wagmi

React hooks for interacting with the 0G Compute Network using wagmi.

## Installation

```bash
npm install 0g-wagmi wagmi viem @tanstack/react-query ethers
```

## Features

- ✅ Add funds to 0G broker
- ✅ Query balance from broker  
- ✅ Wagmi to Ethers signer adapter
- ✅ Full TypeScript support
- ✅ Automatic balance refetching

## Setup

Wrap your app with wagmi and react-query providers:

```tsx
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## Hooks

### `use0gBalance`

Query balance from the 0G broker.

```tsx
import { use0gBalance } from '0g-wagmi'

function BalanceComponent() {
  const { balance, isLoading, refetch } = use0gBalance({
    enabled: true,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <p>Total: {balance?.formattedTotalBalance} OG</p>
      <p>Available: {balance?.formattedAvailableBalance} OG</p>
      <p>Locked: {balance?.formattedLockedBalance} OG</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

### `use0gAddFunds`

Add funds to the 0G broker.

```tsx
import { use0gAddFunds } from '0g-wagmi'

function AddFundsComponent() {
  const { addFunds, isLoading } = use0gAddFunds({
    onSuccess: (txHash) => {
      console.log('Transaction successful:', txHash)
    },
    onError: (error) => {
      console.error('Transaction failed:', error)
    },
  })

  return (
    <button 
      onClick={() => addFunds('0.1')}
      disabled={isLoading}
    >
      {isLoading ? 'Adding...' : 'Add 0.1 OG'}
    </button>
  )
}
```

### `useEthersSigner`

Convert wagmi wallet client to Ethers signer.

```tsx
import { useEthersSigner } from '0g-wagmi'

function Component() {
  const signer = useEthersSigner()
  
  // Use signer with any Ethers.js library
  // including @0glabs/0g-serving-broker
}
```

## Network Configuration

The package includes 0G Testnet configuration:

```tsx
import { ZG_TESTNET_CONFIG } from '0g-wagmi'

// ZG_TESTNET_CONFIG includes:
// - rpcUrl: 'https://evmrpc-testnet.0g.ai'
// - chainId: 16600
// - chainName: '0G Testnet'
```

## Example with Reown (WalletConnect)

```tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { use0gBalance, use0gAddFunds } from '0g-wagmi'

const wagmiAdapter = new WagmiAdapter({
  chains: [zgTestnet],
  projectId: 'YOUR_PROJECT_ID',
})

createAppKit({
  adapters: [wagmiAdapter],
  projectId: 'YOUR_PROJECT_ID',
  networks: [zgTestnet],
})

function App() {
  const { balance } = use0gBalance()
  const { addFunds } = use0gAddFunds()
  
  return (
    <>
      <appkit-button />
      {/* Your app */}
    </>
  )
}
```

## License

MIT