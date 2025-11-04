# iNFT Integration Guide

Complete guide for using Intelligent NFTs (iNFTs) with 0g-wagmi SDK.

## What are iNFTs?

Intelligent NFTs (iNFTs) are AI-powered NFTs that combine:
- 🤖 **AI Agent Intelligence**: Store model weights, configurations, and personalities
- 🔐 **Encrypted Metadata**: Secure storage on 0G Network
- 🎨 **NFT Ownership**: Full ERC-721 compatibility
- 🔄 **Transferable**: Ownership and intelligence together

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    iNFT Architecture                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Wallet                                             │
│       │                                                  │
│       │ 1. Create AI Metadata                           │
│       ├─────────────────────────────►                   │
│       │                                                  │
│       │ 2. Encrypt Metadata                             │
│       ├─────────────────────────────►                   │
│       │                                                  │
│       │ 3. Upload to 0G Storage    ┌──────────────────┐ │
│       ├────────────────────────────►│   0G Storage    │ │
│       │                             │  (Encrypted)     │ │
│       │ 4. Get Root Hash            └──────────────────┘ │
│       │◄────────────────────────────                     │
│       │                                                  │
│       │ 5. Mint NFT                ┌──────────────────┐ │
│       ├────────────────────────────►│ IntelligentNFT │ │
│       │    (with metadata hash)    │   Contract      │ │
│       │                             └──────────────────┘ │
│       │ 6. Receive NFT                                   │
│       │◄────────────────────────────                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Deploy the Smart Contract (Optional)

If you want on-chain NFT minting:

```bash
cd packages/contracts
pnpm install
cp .env.example .env
# Edit .env with your private key
pnpm compile
pnpm deploy
pnpm export
```

Note the deployed contract address and add it to `packages/examples/.env`:

```env
VITE_INFT_CONTRACT_ADDRESS=0x_your_contract_address
```

**Without Contract**: The demo will work without deploying a contract - it will store metadata on 0G Storage but won't mint on-chain NFTs.

### 2. Run the Example

```bash
cd packages/examples
pnpm install
pnpm dev
```

Navigate to the **iNFT** tab and start minting!

## Using iNFT Hooks

### Installation

The iNFT hooks are included in the `0g-wagmi` package:

```bash
npm install 0g-wagmi
```

### Minting iNFTs

```typescript
import { use0gInftMint, InftMetadata } from "0g-wagmi";

function MintComponent() {
  const { mint, isLoading, data, error } = use0gInftMint({
    contractAddress: "0x...", // Optional if set in config
    onSuccess: (result) => {
      console.log("Minted token:", result.tokenId);
      console.log("Metadata hash:", result.metadataHash);
    },
  });

  const handleMint = async () => {
    const metadata: InftMetadata = {
      name: "My AI Agent",
      description: "An intelligent agent with unique capabilities",
      aiModel: "GPT-4",
      image: "https://example.com/image.png",
      modelWeights: "ipfs://weights-hash",
      configuration: {
        temperature: 0.7,
        maxTokens: 2048,
      },
      attributes: [
        { trait_type: "Type", value: "Conversational" },
        { trait_type: "Intelligence", value: 95 },
      ],
    };

    await mint(metadata);
  };

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint iNFT"}
    </button>
  );
}
```

### Listing User's iNFTs

```typescript
import { use0gInftList } from "0g-wagmi";

function MyINFTs() {
  const { infts, isLoading, refetch } = use0gInftList({
    enabled: true,
  });

  if (isLoading) return <div>Loading iNFTs...</div>;

  return (
    <div>
      <h2>My iNFTs ({infts.length})</h2>
      {infts.map((inft) => (
        <div key={inft.tokenId}>
          <p>Token ID: {inft.tokenId}</p>
          <p>Metadata: {inft.metadataHash}</p>
          <p>Minted: {new Date(inft.mintedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

### Viewing iNFT Metadata

```typescript
import { use0gInftMetadata } from "0g-wagmi";

function INFTViewer({ metadataHash }: { metadataHash: string }) {
  const { data: metadata, isLoading, error } = use0gInftMetadata({
    metadataHash,
    enabled: !!metadataHash,
  });

  if (isLoading) return <div>Loading metadata...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!metadata) return null;

  return (
    <div>
      <h3>{metadata.name}</h3>
      <p>{metadata.description}</p>
      {metadata.aiModel && <p>Model: {metadata.aiModel}</p>}
      {metadata.image && <img src={metadata.image} alt={metadata.name} />}
      {metadata.attributes && (
        <div>
          {metadata.attributes.map((attr, i) => (
            <span key={i}>
              {attr.trait_type}: {attr.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Hook API Reference

### `use0gInftMint`

Mint new iNFTs with encrypted metadata on 0G Storage.

**Parameters:**
```typescript
{
  chainId?: number;              // Optional chain ID
  rpcUrl?: string;               // 0G RPC URL (default: testnet)
  indexerUrl?: string;           // 0G Storage indexer URL
  contractAddress?: string;      // iNFT contract address
  onSuccess?: (data) => void;    // Success callback
  onError?: (error) => void;     // Error callback
}
```

**Returns:**
```typescript
{
  mint: (metadata: InftMetadata) => Promise<MintResult>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  data: MintResult | undefined;
  reset: () => void;
}
```

### `use0gInftList`

List all iNFTs owned by the connected wallet.

**Parameters:**
```typescript
{
  chainId?: number;
  contractAddress?: string;
  enabled?: boolean;             // Enable/disable query
}
```

**Returns:**
```typescript
{
  infts: InftToken[];            // Array of owned iNFTs
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

### `use0gInftMetadata`

Fetch and decrypt iNFT metadata from 0G Storage.

**Parameters:**
```typescript
{
  metadataHash?: string;         // 0G Storage root hash
  indexerUrl?: string;
  enabled?: boolean;
}
```

**Returns:**
```typescript
{
  data: InftMetadata | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
```

## TypeScript Types

```typescript
interface InftMetadata {
  name: string;
  description: string;
  image?: string;
  aiModel?: string;
  modelWeights?: string;
  configuration?: Record<string, any>;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface MintResult {
  tokenId: string;
  metadataHash: string;
  txHash: string;
}

interface InftToken {
  tokenId: string;
  metadataHash: string;
  owner: string;
  mintedAt: number;
  txHash?: string;
}
```

## Configuration

### Environment Variables

Create a `.env` file in `packages/examples/`:

```env
# iNFT Contract (optional - demo works without it)
VITE_INFT_CONTRACT_ADDRESS=0x_your_deployed_contract_address

# 0G Network Configuration (defaults are provided)
VITE_OG_RPC_URL=https://evmrpc-testnet.0g.ai
VITE_OG_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai
```

### Contract Configuration

Configure contract addresses for different chains in `0g-wagmi/src/config/contracts.ts`:

```typescript
export const contractAddresses: Record<number, ContractAddresses> = {
  16600: { // 0G Testnet
    inft: process.env.VITE_INFT_CONTRACT_ADDRESS,
  },
  1: { // Mainnet (when available)
    inft: "0x...",
  },
};
```

## Advanced Usage

### Batch Minting

```typescript
const metadata1 = { name: "Agent 1", description: "..." };
const metadata2 = { name: "Agent 2", description: "..." };

await mint(metadata1);
await mint(metadata2);
```

### Custom Encryption

For production, implement proper encryption:

```typescript
// In use0gInftMint.ts, replace the encryptMetadata function
async function encryptMetadata(
  metadata: InftMetadata,
  ownerAddress: string
): Promise<Uint8Array> {
  // Use Web Crypto API with AES-256-GCM
  const key = await generateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(metadata));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  // Seal the key for the owner
  const sealedKey = await sealKeyForOwner(key, ownerAddress);

  // Return combined encrypted data + sealed key
  return combineEncryptedData(encrypted, sealedKey, iv);
}
```

### Re-encryption on Transfer

When transferring an iNFT, re-encrypt metadata for the new owner:

```typescript
import { ethers } from "ethers";

async function transferWithReEncryption(
  tokenId: string,
  fromAddress: string,
  toAddress: string,
  currentMetadataHash: string
) {
  // 1. Download and decrypt current metadata
  const metadata = await fetchAndDecryptMetadata(currentMetadataHash);

  // 2. Re-encrypt for new owner
  const reencrypted = await encryptMetadata(metadata, toAddress);

  // 3. Upload re-encrypted data
  const newHash = await uploadToStorage(reencrypted);

  // 4. Update contract
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  await contract.updateMetadata(tokenId, newHash);

  // 5. Transfer NFT
  await contract.transferFrom(fromAddress, toAddress, tokenId);
}
```

## Production Considerations

1. **Encryption**: Implement proper AES-256-GCM encryption
2. **Key Management**: Use sealed keys for secure access control
3. **Indexing**: Use The Graph or custom indexer for efficient querying
4. **Gas Optimization**: Consider batch operations for multiple mints
5. **IPFS Pinning**: Pin metadata to IPFS for redundancy
6. **Access Control**: Implement proper permission systems

## Troubleshooting

### "No wallet connected"
Make sure you've connected your wallet using the ConnectButton.

### "Contract mint failed"
- Check that `VITE_INFT_CONTRACT_ADDRESS` is set correctly
- Ensure the contract is deployed on the connected network
- Verify you have enough gas

### "Metadata not found"
- Wait for 0G Storage to sync (can take a few seconds)
- Check that the metadata hash is correct
- Verify you're using the correct indexer URL

### "Upload error"
- Check your network connection
- Ensure the file/metadata isn't too large
- Verify the 0G Storage indexer is accessible

## Examples

See the full working example in `packages/examples/src/routes/inft.tsx`.

## Resources

- [0G Network Documentation](https://docs.0g.ai)
- [iNFT Integration Docs](https://docs.0g.ai/developer-hub/building-on-0g/inft/integration)
- [Smart Contract Source](./packages/contracts/contracts/IntelligentNFT.sol)
- [0g-wagmi SDK](./packages/0g-wagmi)

## License

MIT
