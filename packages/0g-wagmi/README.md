# 0G Wagmi SDK

A monorepo containing wagmi hooks for interacting with the 0G Compute Network.

## Packages

- **`0g-wagmi`** - Core SDK with React hooks for 0G Network integration
- **`examples`** - Example React application demonstrating the 0g-wagmi SDK usage
- **`contracts`** - Smart contracts for Intelligent NFTs (iNFTs) with deployment scripts

## 0g-wagmi SDK Usage

### Installation
```bash
npm install 0g-wagmi wagmi viem @tanstack/react-query ethers @0glabs/0g-serving-broker
```

### Quick Reference

| Category | Hook | Description |
|----------|------|-------------|
| **AI Inference** | `use0gChat` | Interact with AI models (streaming & non-streaming) |
| | `use0gServices` | List available AI services |
| | `use0gServiceMetadata` | Get service metadata for a provider |
| | `use0gBroker` | Get underlying broker instance |
| **Broker Balance** | `use0gBalance` | Query broker balance |
| | `use0gAddFunds` | Add funds to broker |
| | `use0gWithdrawFunds` | Withdraw funds from broker |
| | `use0gInferenceBalance` | Query inference balance for provider |
| | `use0gInferenceAddFunds` | Add funds to specific provider |
| **Storage** | `use0gStorageUpload` | Upload files to 0G Storage |
| | `use0gStorageDownload` | Download files from 0G Storage |
| | `use0gStorageFile` | Create 0G file objects & compute merkle root |
| **Key-Value** | `use0gKeyValue` | Store and retrieve key-value pairs |
| **iNFT** | `use0gInftMint` | Mint intelligent NFTs with AI metadata |
| | `use0gInftList` | List user's iNFTs |
| | `use0gInftMetadata` | Fetch and decrypt iNFT metadata |
| **Utilities** | `useEthersSigner` | Convert wagmi client to ethers signer |

### Available Hooks

## AI Inference Hooks

#### `use0gChat` (Non-streaming)
Interact with AI models on the 0G network:

```tsx
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { use0gChat } from '0g-wagmi'

function ChatComponent({ providerAddress }: { providerAddress: string }) {
  const { chat, isLoading, error } = use0gChat(providerAddress)
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async () => {
    try {
      const answer = await chat(question)
      setResponse(answer)
    } catch (err) {
      console.error('Chat error:', err)
    }
  }

  return (
    <div>
      <input 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Send'}
      </button>

      <div>Response:</div>
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {response}
        </ReactMarkdown>
      </div>

      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

In non-streaming mode, the user only receives the final response once the AI has completed all of its processing. The answer is delivered in full at the end, without showing the AI’s intermediate reasoning or thought process.

#### `use0gChat` (Streaming)
Interact with AI models on the 0G network with a streaming response by passing a callback function `(response, reason) => { ... }` in addition to the chat messages:

```tsx
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { use0gChat } from '0g-wagmi'

function ChatComponent({ providerAddress }: { providerAddress: string }) {
  const { chat, isLoading, error } = use0gChat(providerAddress)
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = async () => {
    try {
      const answer = await chat(question, (answer: string, reason: string) => {
        setResponse(answer)
        setReason(reason)
      })
    } catch (err) {
      console.error('Chat error:', err)
    }
  }

  return (
    <div>
      <input 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Send'}
      </button>

      <div>Thinking Reason:</div>
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {reason}
        </ReactMarkdown>
      </div>

      <div>Response:</div>
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {response}
        </ReactMarkdown>
      </div>

      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

In streaming mode, the AI begins sending partial responses as soon as processing starts. Instead of waiting for the full computation to finish, the user can see **both the answer and thinking reason** unfold in real time.

#### Passing a series of chat messages

The `chat` function also supports multi-turn conversations. Simply pass in your conversation as an array of `ChatMessage` objects (`ChatMessage[]`):

```tsx
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { use0gChat, ChatMessage } from '0g-wagmi'

function ChatWithHistory({ providerAddress }: { providerAddress: string }) {
  const { chat, isLoading, error } = use0gChat(providerAddress)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who won the World Cup in 2018?" },
    { role: "assistant", content: "France won the 2018 FIFA World Cup." }
  ])
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = async () => {
    try {
      // Add the new user message to the conversation
      const updatedMessages = [...messages, { role: "user", content: question }]
      setMessages(updatedMessages)

      // Pass the full history to the chat function
      await chat(updatedMessages, (answer: string, reason: string) => {
        setResponse(answer)
        setReason(reason)
      })
    } catch (err) {
      console.error("Chat error:", err)
    }
  }

  return (
    <div>
      <input 
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Processing..." : "Send"}
      </button>

      <div>Thinking Reason:</div>
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {reason}
        </ReactMarkdown>
      </div>

      <div>Response:</div>
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {response}
        </ReactMarkdown>
      </div>

      {error && <div>Error: {error}</div>}
    </div>
  )
}
```

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

#### `use0gWithdrawFunds`
Withdraw funds from the 0G broker:

```tsx
import { use0gWithdrawFunds } from '0g-wagmi'

function WithdrawComponent() {
  const { withdrawFunds, isLoading } = use0gWithdrawFunds({
    onSuccess: (txHash) => {
      console.log('Withdrawal successful:', txHash)
    },
    onError: (error) => {
      console.error('Withdrawal failed:', error)
    },
  })

  return (
    <button 
      onClick={() => withdrawFunds('0.05')}
      disabled={isLoading}
    >
      {isLoading ? 'Withdrawing...' : 'Withdraw 0.05 OG'}
    </button>
  )
}
```

#### `use0gServices`
List available AI services on the 0G network:

```tsx
import { use0gServices } from '0g-wagmi'

function ServicesComponent() {
  const { services, isLoading, error } = use0gServices()

  if (isLoading) return <div>Loading services...</div>
  if (error) return <div>Error loading services</div>
  
  return (
    <div>
      {services?.map((service, index) => (
        <div key={index}>
          <h3>{service.model}</h3>
          <p>Provider: {service.provider}</p>
          <p>Input Price: {service.inputPrice.toString()} per 1M tokens</p>
          <p>Output Price: {service.outputPrice.toString()} per 1M tokens</p>
        </div>
      ))}
    </div>
  )
}
```

#### `use0gInferenceBalance`
Query inference-specific balance for a provider:

```tsx
import { use0gInferenceBalance } from '0g-wagmi'

function InferenceBalanceComponent({ providerAddress }: { providerAddress: string }) {
  const { balance, isLoading, error, refetch } = use0gInferenceBalance(providerAddress)

  if (isLoading) return <div>Loading balance...</div>
  if (error) return <div>Error loading balance</div>
  
  return (
    <div>
      <p>Allocated Credit: {balance ? (Number(balance) / 1e18).toFixed(6) : '0'} OG</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

#### `use0gInferenceAddFunds`
Add funds to a specific inference provider:

```tsx
import { use0gInferenceAddFunds } from '0g-wagmi'

function AddInferenceFundsComponent({ providerAddress }: { providerAddress: string }) {
  const { addFunds, isLoading } = use0gInferenceAddFunds()

  const handleAddFunds = async () => {
    try {
      await addFunds(providerAddress, '0.1')
      console.log('Funds added successfully')
    } catch (err) {
      console.error('Failed to add funds:', err)
    }
  }

  return (
    <button onClick={handleAddFunds} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add 0.1 OG to Provider'}
    </button>
  )
}
```

#### `use0gBroker`
Get the underlying 0G broker instance:

```tsx
import { use0gBroker } from '0g-wagmi'

function BrokerComponent() {
  const { broker, isLoading, error } = use0gBroker()

  if (isLoading) return <div>Initializing broker...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!broker) return <div>Connect wallet to continue</div>

  // Use broker directly for advanced operations
  return <div>Broker initialized</div>
}
```

#### `use0gServiceMetadata`
Get detailed metadata for a specific service provider:

```tsx
import { use0gServiceMetadata } from '0g-wagmi'

function ServiceMetadataComponent({ providerAddress }: { providerAddress: string }) {
  const { metadata, modelName, endpoint, isLoading, error } = use0gServiceMetadata(providerAddress)

  if (isLoading) return <div>Loading service metadata...</div>
  if (error) return <div>Error loading metadata</div>

  return (
    <div>
      <h3>Service Details</h3>
      <p>Model: {modelName}</p>
      <p>Endpoint: {endpoint}</p>
    </div>
  )
}
```

## Storage Hooks

#### `use0gStorageUpload`
Upload files to 0G Storage:

```tsx
import { use0gStorageUpload } from '0g-wagmi'

function UploadComponent() {
  const [file, setFile] = useState<File | null>(null)
  const { upload, isLoading, data, error, isSuccess } = use0gStorageUpload({
    onSuccess: (result) => {
      console.log('File uploaded successfully!')
      console.log('Root Hash:', result.rootHash)
      console.log('Transaction:', result.txHash)
    },
    onError: (err) => {
      console.error('Upload failed:', err)
    },
  })

  const handleUpload = async () => {
    if (!file) return
    try {
      await upload(file)
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? 'Uploading...' : 'Upload to 0G Storage'}
      </button>

      {isSuccess && data && (
        <div>
          <p>Root Hash: {data.rootHash}</p>
          <p>Transaction: {data.txHash}</p>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

#### `use0gStorageDownload`
Download files from 0G Storage:

```tsx
import { use0gStorageDownload } from '0g-wagmi'

function DownloadComponent() {
  const [rootHash, setRootHash] = useState('')
  const { download, downloadAndSave, isLoading, data, error } = use0gStorageDownload({
    onSuccess: (result) => {
      console.log('File downloaded:', result.fileName)
      console.log('Size:', result.fileData.byteLength, 'bytes')
    },
  })

  const handleDownload = async () => {
    if (!rootHash) return
    try {
      // Option 1: Download and get the data
      const result = await download(rootHash, 'my-file.txt')

      // Option 2: Download and automatically save to user's computer
      // await downloadAndSave(rootHash, 'my-file.txt')
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter root hash"
        value={rootHash}
        onChange={(e) => setRootHash(e.target.value)}
      />
      <button onClick={handleDownload} disabled={!rootHash || isLoading}>
        {isLoading ? 'Downloading...' : 'Download from 0G Storage'}
      </button>

      {data && (
        <div>
          <p>File: {data.fileName}</p>
          <p>Size: {(data.fileData.byteLength / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

#### `use0gStorageFile`
Create 0G file objects and compute merkle root hash from browser files:

```tsx
import { use0gStorageFile } from '0g-wagmi'

function FileInfoComponent() {
  const [file, setFile] = useState<File | null>(null)
  const { file: zgFile, rootHash, error, isLoading } = use0gStorageFile(file)

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {isLoading && <div>Computing merkle root...</div>}

      {rootHash && (
        <div>
          <p>File ready for upload</p>
          <p>Root Hash: {rootHash}</p>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

## Key-Value Storage

#### `use0gKeyValue`
Store and retrieve key-value pairs on 0G Network:

```tsx
import { use0gKeyValue } from '0g-wagmi'

function KeyValueComponent() {
  const streamId = 'your-stream-id'
  const {
    setValue,
    getValue,
    cachedValues,
    isSettingValue,
    setSuccess
  } = use0gKeyValue({
    streamId,
    onSetSuccess: (result) => {
      console.log('Value set successfully!')
      console.log('Transaction:', result.txHash)
    },
  })

  // Set a value
  const handleSet = async () => {
    try {
      await setValue('myKey', 'myValue')
    } catch (err) {
      console.error('Set error:', err)
    }
  }

  // Get a value
  const MyValueDisplay = () => {
    const { data: value, isLoading } = getValue('myKey')

    if (isLoading) return <div>Loading...</div>
    return <div>Value: {value || 'Not set'}</div>
  }

  return (
    <div>
      <button onClick={handleSet} disabled={isSettingValue}>
        {isSettingValue ? 'Setting...' : 'Set Value'}
      </button>

      <MyValueDisplay />

      {/* Access cached values */}
      <div>Cached: {cachedValues['myKey'] || 'Not in cache'}</div>
    </div>
  )
}
```

## Intelligent NFT (iNFT) Hooks

#### `use0gInftMint`
Mint intelligent NFTs with encrypted metadata stored on 0G Storage:

```tsx
import { use0gInftMint, InftMetadata } from '0g-wagmi'

function MintInftComponent() {
  const { mint, isLoading, data, error, isSuccess } = use0gInftMint({
    onSuccess: (result) => {
      console.log('iNFT minted!')
      console.log('Token ID:', result.tokenId)
      console.log('Metadata Hash:', result.metadataHash)
    },
  })

  const handleMint = async () => {
    const metadata: InftMetadata = {
      name: 'My AI Agent',
      description: 'An intelligent agent with unique capabilities',
      aiModel: 'GPT-4',
      image: 'https://example.com/image.png',
      modelWeights: 'ipfs://weights-hash',
      configuration: {
        temperature: 0.7,
        maxTokens: 2048,
      },
      attributes: [
        { trait_type: 'Type', value: 'Conversational' },
        { trait_type: 'Intelligence', value: 95 },
      ],
    }

    try {
      await mint(metadata)
    } catch (err) {
      console.error('Mint error:', err)
    }
  }

  return (
    <div>
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Minting...' : 'Mint iNFT'}
      </button>

      {isSuccess && data && (
        <div>
          <p>Token ID: {data.tokenId}</p>
          <p>Metadata Hash: {data.metadataHash}</p>
          <p>Transaction: {data.txHash}</p>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

#### `use0gInftList`
List all iNFTs owned by the connected wallet:

```tsx
import { use0gInftList } from '0g-wagmi'

function MyInftsComponent() {
  const { infts, isLoading, refetch } = use0gInftList({
    enabled: true,
  })

  if (isLoading) return <div>Loading iNFTs...</div>

  return (
    <div>
      <h2>My iNFTs ({infts.length})</h2>
      <button onClick={() => refetch()}>Refresh</button>

      {infts.map((inft) => (
        <div key={inft.tokenId}>
          <p>Token ID: {inft.tokenId}</p>
          <p>Metadata Hash: {inft.metadataHash}</p>
          <p>Owner: {inft.owner}</p>
          <p>Minted: {new Date(inft.mintedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

#### `use0gInftMetadata`
Fetch and decrypt iNFT metadata from 0G Storage:

```tsx
import { use0gInftMetadata } from '0g-wagmi'

function InftMetadataComponent({ metadataHash }: { metadataHash: string }) {
  const { data: metadata, isLoading, error } = use0gInftMetadata({
    metadataHash,
    enabled: !!metadataHash,
  })

  if (isLoading) return <div>Loading metadata...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!metadata) return null

  return (
    <div>
      <h3>{metadata.name}</h3>
      <p>{metadata.description}</p>

      {metadata.aiModel && <p>AI Model: {metadata.aiModel}</p>}

      {metadata.image && (
        <img src={metadata.image} alt={metadata.name} />
      )}

      {metadata.attributes && (
        <div>
          <h4>Attributes:</h4>
          {metadata.attributes.map((attr, i) => (
            <span key={i}>
              {attr.trait_type}: {attr.value}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Utility Hooks

#### `useEthersSigner`
Convert wagmi wallet client to ethers.js signer (useful for advanced integrations):

```tsx
import { useEthersSigner } from '0g-wagmi'
import { ethers } from 'ethers'

function CustomContractComponent() {
  const signer = useEthersSigner()

  const interactWithContract = async () => {
    if (!signer) return

    // Use signer with ethers.js contracts
    const contract = new ethers.Contract(contractAddress, abi, signer)
    const tx = await contract.someFunction()
    await tx.wait()
  }

  return (
    <button onClick={interactWithContract} disabled={!signer}>
      Interact with Contract
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
      child_process: "/src/empty.js",
      "fs/promises": "/src/empty.js",
      fs: "/src/empty.js",
      path: "/src/empty.js",
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

## iNFT Smart Contracts

This repository includes complete smart contract infrastructure for Intelligent NFTs (iNFTs). See the dedicated documentation:

- **[Quick Start Guide](./INFT_QUICKSTART.md)** - Get started in 5 minutes
- **[Integration Guide](./INFT_INTEGRATION.md)** - Complete API reference and examples
- **[Contract Documentation](./packages/contracts/README.md)** - Smart contract details and deployment

### iNFT Features

- 🤖 **AI-Powered NFTs** - Store AI models, weights, and configurations
- 🔐 **Encrypted Metadata** - Secure storage on 0G Network
- 🎨 **ERC-721 Compatible** - Works with existing NFT infrastructure
- 📦 **Full Type Safety** - TypeScript support throughout
- 🚀 **Production Ready** - Audited OpenZeppelin contracts

To deploy the iNFT contract:

```bash
cd packages/contracts
pnpm install
cp .env.example .env
# Edit .env with your private key
pnpm deploy
```

See [INFT_QUICKSTART.md](./INFT_QUICKSTART.md) for detailed instructions.

## Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the SDK and examples:**
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

   Optionally, add your deployed iNFT contract address:
   ```
   VITE_INFT_CONTRACT_ADDRESS=0x_your_contract_address
   ```

   Get your project ID from [Reown Cloud](https://cloud.reown.com/)

4. **Run the example app:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173` (or next available port)

## Examples

The examples package demonstrates all available hooks:

- **AI Inference** - Chat with AI models on 0G Network
- **Storage** - Upload and download files to/from 0G Storage
- **Key-Value** - Store and retrieve key-value pairs
- **iNFT** - Mint and manage intelligent NFTs
- **Broker Management** - Add/withdraw funds, check balances

Navigate through the tabs in the demo app to explore each feature.

## Additional Resources

- [0G Network Documentation](https://docs.0g.ai)
- [0G iNFT Integration Docs](https://docs.0g.ai/developer-hub/building-on-0g/inft/integration)
- [Reown (WalletConnect) Setup](https://cloud.reown.com/)

## License

MIT