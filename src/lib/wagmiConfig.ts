import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { mockInjected } from './mockConnector';

// Simplified config with mock connector to avoid MetaMask SDK loading issues
export const config = createConfig({
  chains: [mainnet],
  connectors: [
    mockInjected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: false,
});