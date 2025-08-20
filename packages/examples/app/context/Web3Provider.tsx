import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { type ReactNode } from "react";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
  name: "0G Wagmi Example",
  description: "0G Wagmi React Hooks Example",
  url: "https://0g.ai",
  icons: ["https://0g.ai/favicon.ico"],
};

const zgTestnet = {
  id: 16601,
  name: "0G Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "0G",
    symbol: "OG",
  },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
    public: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://chainscan-galileo.0g.ai" },
  },
  testnet: true,
} as const;

const chains = [zgTestnet];

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: chains,
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains as any,
  metadata,
  features: {
    analytics: true,
  },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
