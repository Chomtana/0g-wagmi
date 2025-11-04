# iNFT Smart Contracts

Smart contracts for Intelligent NFTs (iNFTs) on 0G Network.

## Overview

The `IntelligentNFT` contract is an ERC-721 NFT that stores encrypted AI agent metadata on 0G Storage. Each iNFT represents an AI agent with its model, weights, and configuration stored securely and verifiably on-chain.

## Features

- ✅ **ERC-721 Standard**: Full compatibility with existing NFT infrastructure
- 🔐 **Encrypted Metadata**: Metadata stored on 0G Storage with encryption
- 🤖 **AI Integration**: Support for AI model configurations and weights
- 🔄 **Secure Transfers**: Re-encryption support for ownership changes
- 📊 **Enumeration**: Query all tokens owned by an address
- 🎯 **Gas Optimized**: Efficient storage and operations

## Contract Functions

### Minting

```solidity
// Mint a single iNFT
function mint(address to, string memory metadataHash) public returns (uint256)

// Batch mint multiple iNFTs (up to 50 at once)
function batchMint(address to, string[] memory metadataHashes) public returns (uint256[])
```

### Metadata Management

```solidity
// Get metadata hash for a token
function getMetadataHash(uint256 tokenId) public view returns (string memory)

// Update metadata (e.g., after re-encryption)
function updateMetadata(uint256 tokenId, string memory newMetadataHash) public

// Get comprehensive token info
function getTokenInfo(uint256 tokenId) public view returns (address, string memory, uint256)
```

### Queries

```solidity
// Get all token IDs owned by an address
function tokensOfOwner(address owner) public view returns (uint256[])

// Get mint timestamp
function getMintTimestamp(uint256 tokenId) public view returns (uint256)

// Get total supply
function totalSupply() public view returns (uint256)

// Get next token ID to be minted
function getNextTokenId() public view returns (uint256)
```

## Setup

### 1. Install Dependencies

```bash
cd packages/contracts
pnpm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PRIVATE_KEY=your_private_key_without_0x_prefix
OG_RPC_URL=https://evmrpc-testnet.0g.ai
OG_STORAGE_URL=https://indexer-storage-testnet-turbo.0g.ai
```

### 3. Compile Contracts

```bash
pnpm compile
```

## Deployment

### Deploy to 0G Testnet

```bash
pnpm deploy
```

This will:
1. Deploy the `IntelligentNFT` contract
2. Save deployment info to `deployments/`
3. Display the contract address

### Deploy to Local Network

First, start a local Hardhat node:

```bash
npx hardhat node
```

Then in another terminal:

```bash
pnpm deploy:local
```

## Export Contract ABI

After deployment, export the contract ABI for use in the frontend:

```bash
pnpm export
```

This will:
- Export ABI and deployment addresses to `exports/contract.json`
- Copy the contract data to `packages/examples/src/contracts/`

## Integration with Frontend

### 1. Set Contract Address

After deployment, add the contract address to your `.env` in the examples package:

```env
VITE_INFT_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

### 2. Rebuild Packages

```bash
cd ../..
pnpm -r build
```

### 3. Start Development Server

```bash
cd packages/examples
pnpm dev
```

## Usage Example

```typescript
import { ethers } from "ethers";

// Connect to contract
const contract = new ethers.Contract(
  contractAddress,
  IntelligentNFT.abi,
  signer
);

// Mint an iNFT
const tx = await contract.mint(
  userAddress,
  "0x1234...metadata_hash_from_0g_storage"
);
const receipt = await tx.wait();

// Get token info
const [owner, metadataHash, mintTime] = await contract.getTokenInfo(tokenId);

// Get all tokens owned by user
const tokens = await contract.tokensOfOwner(userAddress);

// Update metadata (for re-encryption)
await contract.updateMetadata(tokenId, newMetadataHash);
```

## Contract Architecture

```
IntelligentNFT (ERC-721)
├── Minting
│   ├── mint(to, metadataHash)
│   └── batchMint(to, metadataHashes[])
├── Metadata
│   ├── getMetadataHash(tokenId)
│   ├── updateMetadata(tokenId, newHash)
│   └── getTokenInfo(tokenId)
└── Enumeration
    ├── tokensOfOwner(owner)
    ├── totalSupply()
    └── getNextTokenId()
```

## Security Considerations

1. **Metadata Encryption**: Ensure metadata is encrypted before uploading to 0G Storage
2. **Access Control**: Only token owners can update metadata
3. **Re-encryption**: Implement proper re-encryption when transferring tokens
4. **Gas Limits**: Be aware of gas costs for `tokensOfOwner()` with large collections

## Testing

```bash
pnpm test
```

## Contract Verification

After deployment, you can verify the contract on a block explorer:

```bash
npx hardhat verify --network zgtestnet DEPLOYED_CONTRACT_ADDRESS
```

## License

MIT
