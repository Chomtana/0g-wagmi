export { use0gAddFunds, type Use0gAddFundsParams } from "./hooks/use0gAddFunds";
export {
  use0gWithdrawFunds,
  type Use0gWithdrawFundsParams,
} from "./hooks/use0gWithdrawFunds";
export {
  use0gBalance,
  type Use0gBalanceParams,
  type LedgerAccount,
} from "./hooks/use0gBalance";
export {
  use0gInferenceBalance,
  type Use0gInferenceBalanceParams,
  type LedgerInferenceAccount,
} from "./hooks/use0gInferenceBalance";
export {
  use0gInferenceAddFunds,
  type Use0gInferenceAddFundsParams,
} from "./hooks/use0gInferenceAddFunds";
export { use0gBroker } from "./hooks/use0gBroker";
export { use0gServices } from "./hooks/use0gServices";
export { use0gChat, type Use0gChatReturn } from "./hooks/use0gChat";
export { useEthersSigner } from "./hooks/useEthersSigner";
export {
  walletClientToSigner,
  publicClientToProvider,
} from "./adapters/ethers";

export const ZG_TESTNET_CONFIG = {
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
