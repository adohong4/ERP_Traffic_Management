import { createConfig, http } from 'wagmi';
import { mainnet, base, optimism } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, base, optimism],
  connectors: [
    walletConnect({
      projectId: "49686bebdea901a178af5e8ac4845f65",
      showQrModal: true,
    }),
    metaMask(),
    injected()
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
  ssr: false,
});