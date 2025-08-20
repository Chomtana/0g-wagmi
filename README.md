# 0G Wagmi SDK

A monorepo containing wagmi hooks for interacting with the 0G Compute Network.

## Packages

- **`0g-wagmi`** - Core SDK with React hooks for 0G Network integration
- **`examples`** - Example React Router application demonstrating the SDK usage

## 0g-wagmi SDK Usage

### Installation
```bash
npm install 0g-wagmi wagmi viem @tanstack/react-query ethers
```

### Available Hooks

#### `use0gBalance`
Query balance from the 0G broker:

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
      <p>Total: {balance ? (Number(balance.totalBalance) / 1e18).toFixed(6) : '0'} OG</p>
      <p>Available: {balance ? (Number(balance.availableBalance) / 1e18).toFixed(6) : '0'} OG</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

#### `use0gAddFunds`
Add funds to the 0G broker:

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

## Polyfills

The `@0glabs/0g-serving-broker` package depends on several Node.js server-side modules that are not available in the browser. To prevent build errors, make sure to exclude these modules from the Vite build process by creating `app/empty.js` and updating your configuration as shown below. You also need to include a Buffer polyfill.

### app/empty.js

```javascript
const unsupported = (name) => (..._args) => {
  throw new Error(`child_process.${name} is not supported in this environment`);
};

// Functions
export const spawn = unsupported("spawn");
export const exec = unsupported("exec");
export const execFile = unsupported("execFile");
export const fork = unsupported("fork");
export const execSync = unsupported("execSync");
export const spawnSync = unsupported("spawnSync");
export const execFileSync = unsupported("execFileSync");

// Classes / symbols that libraries sometimes reference
export class ChildProcess {}
export const forkOpts = {}; // placeholder sometimes used in examples

// Default export with the same members (helps with `import cp from 'child_process'`)
export default {
  spawn,
  exec,
  execFile,
  fork,
  execSync,
  spawnSync,
  execFileSync,
  ChildProcess,
  forkOpts,
};
```

### vite.config.ts

```typescript
export default defineConfig({
  ...,
  resolve: {
    alias: {
      child_process: "/app/empty.js",
      "fs/promises": "/app/empty.js",
      fs: "/app/empty.js",
      path: "/app/empty.js",
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["buffer"],
  },
});
```

### package.json
Install `buffer` package

## Launch the Example

The SDK includes 0G Testnet configuration:

```tsx
import { ZG_TESTNET_CONFIG } from '0g-wagmi'

// ZG_TESTNET_CONFIG includes:
// - rpcUrl: 'https://evmrpc-testnet.0g.ai'
// - chainId: 16600
// - chainName: '0G Testnet'
```

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the SDK:**
   ```bash
   pnpm build
   ```

3. **Set up environment variables for the example app:**
   ```bash
   cp packages/examples/.env.example packages/examples/.env
   ```
   
   Edit `packages/examples/.env` and add your Reown (WalletConnect) project ID:
   ```
   REOWN_PROJECT_ID=your_project_id_here
   ```
   
   Get your project ID from [Reown Cloud](https://cloud.reown.com/)

4. **Run the example app:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173` (or next available port)

## Development

### Build all packages:
```bash
pnpm -r build
```

### Run in development mode:
```bash
# SDK watch mode
cd packages/0g-wagmi && pnpm dev

# Example app
cd packages/examples && pnpm dev
```

## License

MIT