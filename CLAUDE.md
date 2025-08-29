# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo using pnpm workspaces with the following structure:
- `/packages/0g-wagmi/` - Core 0g-wagmi SDK package with React hooks for 0G Network integration
- `/packages/examples/` - React Router example application demonstrating 0g-wagmi usage with Reown wallet connector

## Hover cursor pointer

Add `hover:cursor-pointer` to all clickable buttons

## Commands

### 0g-wagmi Package
Located in `/packages/0g-wagmi/`:

```bash
# Build the package
pnpm build
```

Do NOT run `pnpm dev`

### Examples Package (React Router App)
Located in `/packages/examples/`:

```bash
# Development server with HMR
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck
```

### Root Level
Uses pnpm as package manager (v10.11.0):
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build
```

## Architecture

### 0g-wagmi SDK Package
The core SDK package provides:
- **React Hooks** for 0G Network integration:
  - `use0gBalance` - Query balance from 0G broker
  - `use0gAddFunds` - Add funds to 0G broker
  - `useEthersSigner` - Convert wagmi wallet client to Ethers signer
- **Wagmi to Ethers Adapter** for compatibility with 0G SDK
- **TypeScript** support with full type definitions
- **Built with tsup** for optimal bundle size and performance

### React Router Application
The examples package is a modern React Router v7 application with:
- **Server-side rendering (SSR)** enabled by default (configured in `react-router.config.ts`)
- **Vite** as the build tool with plugins for React Router, Tailwind CSS, and TypeScript path resolution
- **Tailwind CSS v4** with Vite integration for styling
- **TypeScript** for type safety
- **Reown (WalletConnect)** integration for wallet connectivity
- **0g-wagmi hooks** demonstration
- **Route configuration** in `app/routes.ts` using file-based routing
- **Entry points**:
  - `app/root.tsx` - Root component with Web3Provider
  - `app/routes/home.tsx` - Landing page with SDK overview
  - `app/routes/0g-demo.tsx` - Interactive demo page

### Key Dependencies
- **0G SDK**: `@0glabs/0g-serving-broker` for broker interactions
- **Wagmi**: For Ethereum wallet connectivity
- **Ethers v6**: For blockchain interactions
- **Reown AppKit**: Modern wallet connection UI
- **TanStack Query**: For data fetching and caching

### Deployment
The examples app is Docker-ready with a Dockerfile for containerized deployment. The build outputs to:
- `build/client/` - Static assets
- `build/server/` - Server-side code

### Development Workflow
1. The monorepo uses pnpm workspaces for dependency management
2. 0g-wagmi package is linked locally via workspace protocol
3. React Router handles both client and server-side rendering
4. Vite provides fast HMR during development
5. TypeScript paths are resolved via `vite-tsconfig-paths` plugin