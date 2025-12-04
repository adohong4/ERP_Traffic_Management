import { createConnector } from 'wagmi';

// Mock connector to avoid MetaMask SDK auto-loading issues
export function mockInjected() {
  return createConnector((config) => ({
    id: 'mock-injected',
    name: 'Injected Wallet',
    type: 'injected' as const,
    
    async connect() {
      // Check if there's a real wallet available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        try {
          const accounts = await provider.request({ 
            method: 'eth_requestAccounts' 
          });
          const chainId = await provider.request({ 
            method: 'eth_chainId' 
          });
          
          return {
            accounts: accounts as `0x${string}`[],
            chainId: parseInt(chainId, 16),
          };
        } catch (error) {
          throw new Error('User rejected connection');
        }
      }
      
      // Mock connection for demo
      return {
        accounts: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as `0x${string}`],
        chainId: 1,
      };
    },
    
    async disconnect() {
      // Nothing to do for mock
    },
    
    async getAccounts() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        const accounts = await provider.request({ 
          method: 'eth_accounts' 
        });
        return accounts as `0x${string}`[];
      }
      return [];
    },
    
    async getChainId() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        const chainId = await provider.request({ 
          method: 'eth_chainId' 
        });
        return parseInt(chainId, 16);
      }
      return 1; // Default to mainnet
    },
    
    async getProvider() {
      // Return the ethereum provider if available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        return (window as any).ethereum;
      }
      // Return a minimal mock provider for demo
      return {
        request: async ({ method, params }: any) => {
          if (method === 'eth_chainId') return '0x1';
          if (method === 'eth_accounts') return [];
          if (method === 'eth_requestAccounts') return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'];
          return null;
        },
        on: () => {},
        removeListener: () => {},
      };
    },
    
    async isAuthorized() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await this.getAccounts();
          return accounts.length > 0;
        } catch {
          return false;
        }
      }
      return false;
    },
    
    async switchChain({ chainId }) {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
          return config.chains.find(c => c.id === chainId) || config.chains[0];
        } catch (error) {
          throw new Error('Failed to switch chain');
        }
      }
      return config.chains.find(c => c.id === chainId) || config.chains[0];
    },
    
    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.onDisconnect?.();
      } else {
        config.emitter.emit('change', { 
          accounts: accounts as `0x${string}`[] 
        });
      }
    },
    
    onChainChanged(chainId) {
      const id = parseInt(chainId, 16);
      config.emitter.emit('change', { chainId: id });
    },
    
    async onDisconnect() {
      config.emitter.emit('disconnect');
    },
    
    async setup() {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        
        if (provider.on) {
          provider.on('accountsChanged', this.onAccountsChanged.bind(this));
          provider.on('chainChanged', this.onChainChanged.bind(this));
          provider.on('disconnect', this.onDisconnect.bind(this));
        }
      }
    },
  }));
}