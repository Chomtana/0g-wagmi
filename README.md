# 0G Wagmi SDK

A monorepo containing wagmi hooks for interacting with the 0G Compute Network.

## Packages

- **`0g-wagmi`** - Core SDK with React hooks for 0G Network integration
- **`examples`** - Example React application demonstrating the 0g-wagmi SDK usage

## 0g-wagmi SDK Usage

### Installation
```bash
npm install 0g-wagmi wagmi viem @tanstack/react-query ethers @0glabs/0g-serving-broker
```

### Available Hooks

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
   
   Get your project ID from [Reown Cloud](https://cloud.reown.com/)

4. **Run the example app:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173` (or next available port)

## License

MIT