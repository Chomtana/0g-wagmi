import { zeroGMainnet, zeroGGalileoTestnet } from "viem/chains";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { type ReactNode } from "react";

const temporaryTestnet = {
  ...zeroGGalileoTestnet,
  id: 16602,
};

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "YOUR_PROJECT_ID";

const metadata = {
  name: "0G Wagmi Example",
  description: "0G Wagmi React Hooks Example",
  url: "https://0g.ai",
  icons: ["https://0g.ai/favicon.ico"],
};

const chains = [zeroGMainnet, temporaryTestnet];

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
