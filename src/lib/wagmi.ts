import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { monad, monadTestnet } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

// Optional: only needed for WalletConnect (mobile wallets via QR).
// Free project ID at https://dashboard.reown.com
const wcProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

export const config = createConfig({
  // Testnet first — this becomes the chain the app asks wallets for by default.
  chains: [monadTestnet, monad],
  connectors: [
    injected(), // MetaMask, Rabby, Phantom — any EIP-6963 wallet
    coinbaseWallet({ appName: 'phosphor' }),
    ...(wcProjectId ? [walletConnect({ projectId: wcProjectId })] : []),
  ],
  transports: {
    // Uses the public RPC from viem's chain definition.
    // Swap in Alchemy/dRPC when you start hitting rate limits:
    //   [monadTestnet.id]: http(process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC),
    [monadTestnet.id]: http(),
    [monad.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

// Gives every wagmi hook in the app precise types for these chains.
declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
