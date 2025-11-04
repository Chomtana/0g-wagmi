# iNFT Quick Start

Get started with Intelligent NFTs in 5 minutes!

## Option 1: Demo Mode (No Contract Deployment)

Perfect for testing the UI and 0G Storage integration without deploying contracts.

```bash
# 1. Install dependencies
pnpm install

# 2. Build packages
pnpm -r build

# 3. Start the example app
cd packages/examples
pnpm dev
```

Open http://localhost:5173, connect your wallet, navigate to the **iNFT** tab, and start minting!

**Note**: In demo mode, metadata is uploaded to 0G Storage but NFTs are not minted on-chain.

## Option 2: Full On-Chain Integration

Deploy the smart contract for full on-chain NFT minting.

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Deploy the Contract

```bash
cd packages/contracts
pnpm install

# Configure your deployer wallet
cp .env.example .env
# Edit .env and add your PRIVATE_KEY
```

Edit `.env`:
```env
PRIVATE_KEY=your_private_key_without_0x_prefix
OG_RPC_URL=https://evmrpc-testnet.0g.ai
```

Deploy:
```bash
pnpm compile
pnpm deploy
```

Note the deployed contract address from the output.

### Step 3: Export Contract ABI

```bash
pnpm export
```

This copies the contract ABI to the examples package.

### Step 4: Configure the Frontend

```bash
cd ../examples
cp .env.example .env
```

Edit `.env` and add your contract address:
```env
VITE_INFT_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

### Step 5: Build and Run

```bash
cd ../..
pnpm -r build
cd packages/examples
pnpm dev
```

Open http://localhost:5173 and start minting on-chain iNFTs!

## What's Next?

### Mint Your First iNFT

1. **Connect Wallet**: Click "Connect Wallet" in the top-right
2. **Navigate to iNFT**: Click the "iNFT" tab in the navigation
3. **Fill in Details**:
   - Name: "My AI Agent"
   - Description: "An intelligent assistant"
   - AI Model: "GPT-4" (optional)
   - Image URL: (optional)
4. **Click "Mint iNFT"**: Wait for the transaction to complete
5. **View Your NFT**: Scroll down to "My iNFTs" to see your minted NFT

### View NFT Metadata

Click on any NFT card in "My iNFTs" to view its decrypted metadata including:
- Name and description
- AI model information
- Attributes and traits
- Image (if provided)

## Features

✅ **Mint iNFTs** with encrypted metadata on 0G Storage
✅ **View Your Collection** of AI-powered NFTs
✅ **Query Metadata** stored securely on 0G
✅ **On-Chain Verification** (when contract is deployed)
✅ **Full TypeScript** support with type safety

## Architecture

```
User Action → React Hook → 0G Storage Upload → Smart Contract Mint → NFT Created
                ↓
          Encrypted Metadata
                ↓
          0G Storage (IPFS-like)
                ↓
          Metadata Hash → Stored in NFT
```

## Troubleshooting

### "Please connect your wallet first"
- Click the "Connect Wallet" button in the top-right corner
- Approve the connection in your wallet

### "No contract address configured"
- This is normal in demo mode
- To enable on-chain minting, follow Option 2 and deploy the contract

### Build errors
```bash
# Clean and rebuild
rm -rf node_modules
pnpm install
pnpm -r build
```

### Need testnet tokens?
- Visit the [0G Faucet](https://faucet.0g.ai) (if available)
- Or ask in the [0G Discord](https://discord.gg/0g) for testnet tokens

## Package Structure

```
0g-wagmi/
├── packages/
│   ├── 0g-wagmi/          # SDK with React hooks
│   │   └── src/
│   │       ├── hooks/      # iNFT hooks
│   │       │   ├── use0gInftMint.ts
│   │       │   ├── use0gInftList.ts
│   │       │   └── use0gInftMetadata.ts
│   │       └── config/     # Contract addresses
│   ├── contracts/         # Smart contracts
│   │   ├── contracts/
│   │   │   └── IntelligentNFT.sol
│   │   └── scripts/
│   │       └── deploy.ts
│   └── examples/          # Demo application
│       └── src/
│           └── routes/
│               └── inft.tsx
└── INFT_INTEGRATION.md   # Full documentation
```

## Next Steps

- 📖 Read the [Full Integration Guide](./INFT_INTEGRATION.md)
- 🔧 Check the [Contract Documentation](./packages/contracts/README.md)
- 🌐 Visit [0G Documentation](https://docs.0g.ai)
- 💬 Join the [0G Community](https://discord.gg/0g)

## Support

- **Issues**: https://github.com/Chomtana/0g-wagmi/issues
- **Discord**: https://discord.gg/0g
- **Docs**: https://docs.0g.ai

Happy minting! 🎉
