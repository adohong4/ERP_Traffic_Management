import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wallet, Shield, Lock, CheckCircle, ExternalLink, FileKey } from 'lucide-react';
import { toast } from 'sonner';
import { useConnect, useAccount, useDisconnect, useSignMessage } from 'wagmi';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [shouldAutoSign, setShouldAutoSign] = useState(false); // Flag to control auto-sign
  const { connect, connectors, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Reset wallet connection on mount (when returning to login page after logout)
  useEffect(() => {
    // Disable auto-sign initially
    setShouldAutoSign(false);
    setIsSigning(false);
    setSelectedConnector(null);
    
    // Disconnect wallet if still connected (from previous session)
    const disconnectWallet = async () => {
      try {
        if (isConnected) {
          await disconnect();
        }
      } catch (err) {
        // Silently handle disconnect errors
        console.log('Disconnect handled:', err);
      }
    };
    
    disconnectWallet();
  }, []); // Run only on mount

  // Generate random nonce for signing
  const generateNonce = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  // Auto sign nonce when wallet connected (ONLY if shouldAutoSign is true)
  useEffect(() => {
    const handleSignNonce = async () => {
      // CRITICAL: Only auto-sign if explicitly allowed
      if (isConnected && address && !isSigning && shouldAutoSign) {
        setIsSigning(true);
        
        try {
          // Show signing status
          toast.info('Đang xác thực chữ ký...');
          
          // Generate nonce
          const nonce = generateNonce();
          const message = `Xác thực đăng nhập ERP GPLX\n\nĐịa chỉ: ${address}\nNonce: ${nonce}\nThời gian: ${new Date().toISOString()}`;
          
          // Request signature
          const signature = await signMessageAsync({ message });
          
          // Success
          toast.success(`Xác thực thành công! Địa chỉ: ${address.slice(0, 6)}...${address.slice(-4)}`);
          
          // Save auth data
          localStorage.setItem('wallet_address', address);
          localStorage.setItem('wallet_signature', signature);
          localStorage.setItem('wallet_nonce', nonce);
          
          setTimeout(() => {
            onLogin();
          }, 500);
        } catch (err: any) {
          console.error('Signature error:', err);
          
          // Better error message based on error type
          if (err.name === 'UserRejectedRequestError' || err.message?.includes('User rejected')) {
            toast.error('Bạn đã từ chối xác thực. Vui lòng thử lại.');
          } else {
            toast.error('Lỗi xác thực. Vui lòng thử lại.');
          }
          
          // Disconnect wallet if user rejected signature (with error handling)
          try {
            await disconnect();
          } catch (disconnectErr) {
            // Silently handle disconnect errors
            console.log('Disconnect error handled:', disconnectErr);
          }
          
          setIsSigning(false);
          setSelectedConnector(null);
          setShouldAutoSign(false); // Reset flag
        }
      }
    };

    handleSignNonce();
  }, [isConnected, address, disconnect, onLogin, signMessageAsync, isSigning, shouldAutoSign]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(`Lỗi kết nối: ${error.message}`);
      setSelectedConnector(null);
    }
  }, [error]);

  // Map connectors to wallet options with safe filtering
  const walletOptions = useMemo(() => {
    try {
      // Guard against undefined connectors
      if (!connectors || !Array.isArray(connectors)) {
        console.warn('Connectors is not an array:', connectors);
        return [];
      }

      return connectors
        // CRITICAL: Filter out invalid connectors first
        .filter(connector => {
          try {
            // Check if connector has required methods
            if (!connector) {
              console.warn('Null connector found');
              return false;
            }
            if (typeof connector.connect !== 'function') {
              console.warn('Filtering out connector without connect:', connector.name || 'unknown');
              return false;
            }
            return true;
          } catch (err) {
            console.error('Error checking connector:', err);
            return false;
          }
        })
        .map(connector => {
          try {
            const name = connector.name || 'Unknown Wallet';
            const id = connector.id || connector.name || `wallet-${Math.random()}`;
            let icon = '🦊';
            let description = 'Kết nối với MetaMask Wallet';
            let popular = true;

            // Match specific wallet types based on connector ID
            if (id.toLowerCase().includes('walletconnect') || name.toLowerCase().includes('walletconnect')) {
              icon = '🔗';
              description = 'Quét QR code để kết nối ví';
              popular = true;
            } else if (id.toLowerCase().includes('coinbase') || name.toLowerCase().includes('coinbase')) {
              icon = '🔵';
              description = 'Kết nối với Coinbase Wallet';
              popular = false;
            } else if (id.toLowerCase().includes('trust') || name.toLowerCase().includes('trust')) {
              icon = '🛡️';
              description = 'Kết nối với Trust Wallet';
              popular = false;
            } else if (id.toLowerCase().includes('injected') || id.toLowerCase().includes('metamask')) {
              // MetaMask or injected wallet
              icon = '🦊';
              description = 'Kết nối với MetaMask Wallet';
              popular = true;
            }

            return {
              id,
              connector,
              name: name === 'Injected' ? 'MetaMask' : name,
              icon,
              description,
              popular
            };
          } catch (err) {
            console.error('Error mapping connector:', err);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries from mapping errors
    } catch (err) {
      console.error('Critical error processing connectors:', err);
      return [];
    }
  }, [connectors]);

  // Default wallets to always show if no connectors
  const defaultWallets = [
    {
      id: 'metamask-placeholder',
      connector: null as any,
      name: 'MetaMask',
      icon: '🦊',
      description: 'Vui lòng cài đặt MetaMask Extension',
      popular: true
    },
    {
      id: 'walletconnect-placeholder',
      connector: null as any,
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Quét QR code để kết nối ví',
      popular: true
    },
    {
      id: 'trust-placeholder',
      connector: null as any,
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Kết nối với Trust Wallet',
      popular: false
    }
  ];

  // Always show all 3 wallet options with enhanced UI
  const displayWallets = useMemo(() => {
    // If we have real connectors, use them for MetaMask
    if (walletOptions.length > 0) {
      const realConnector = walletOptions[0];
      return [
        {
          ...realConnector,
          id: 'metamask-real',
          name: 'MetaMask',
          icon: '🦊',
          description: 'Kết nối với MetaMask Wallet',
          popular: true
        },
        {
          id: 'walletconnect-demo',
          connector: null as any,
          name: 'WalletConnect',
          icon: '🔗',
          description: 'Quét QR code để kết nối (Coming Soon)',
          popular: true
        },
        {
          id: 'trust-demo',
          connector: null as any,
          name: 'Trust Wallet',
          icon: '🛡️',
          description: 'Kết nối với Trust Wallet (Coming Soon)',
          popular: false
        }
      ];
    }
    
    // Otherwise show placeholders
    return defaultWallets;
  }, [walletOptions]);

  const handleConnectWallet = async (wallet: typeof displayWallets[0]) => {
    // Strict validation Layer 1: Check if wallet and connector exist
    if (!wallet) {
      toast.error('Ví không hợp lệ');
      return;
    }
    
    if (!wallet.connector) {
      const walletName = wallet.name;
      let downloadUrl = 'https://metamask.io/download/';
      
      if (walletName.toLowerCase().includes('trust')) {
        downloadUrl = 'https://trustwallet.com/download';
      } else if (walletName.toLowerCase().includes('walletconnect')) {
        // WalletConnect doesn't need download, just needs to be configured
        toast.info('Vui lòng chờ...');
        return;
      }
      
      toast.error(`Vui lòng cài đặt ${walletName}`);
      window.open(downloadUrl, '_blank');
      return;
    }

    // Strict validation Layer 2: Check if connector has required methods
    const connector = wallet.connector;
    
    if (typeof connector.connect !== 'function') {
      console.error('Connector missing connect method:', connector);
      toast.error('Ví này không hỗ trợ kết nối');
      return;
    }

    // Strict validation Layer 3: Check for getChainId method (skip for WalletConnect)
    const isWalletConnect = wallet.name.toLowerCase().includes('walletconnect') || connector.id === 'walletConnect';
    
    // Skip getChainId validation - not all connectors in wagmi v2+ have this method
    // if (!isWalletConnect && typeof connector.getChainId !== 'function') {
    //   console.error('Connector missing getChainId method:', connector);
    //   toast.error('Ví này không tương thích với hệ thống');
    //   return;
    // }

    // Validation Layer 4: Try to get chainId before connecting (skip - not supported in all connectors)
    // if (!isWalletConnect) {
    //   try {
    //     const chainId = await connector.getChainId();
    //     console.log('Connector validated, chainId:', chainId);
    //   } catch (err) {
    //     console.error('Connector chainId check failed:', err);
    //     toast.error('Không thể xác thực ví. Vui lòng thử lại.');
    //     return;
    //   }
    // }

    setSelectedConnector(wallet.id);

    try {
      // Enable auto-sign when user intentionally connects wallet
      setShouldAutoSign(true);
      
      // WalletConnect SDK will automatically show QR modal
      await connect({ connector: wallet.connector });
    } catch (err: any) {
      console.error('Connection error:', err);
      
      // User rejected or closed QR modal
      if (err.message?.includes('User rejected') || err.message?.includes('User closed modal')) {
        toast.info('Bạn đã hủy kết nối');
      } else {
        toast.error('Không thể kết nối ví. Vui lòng thử lại.');
      }
      setSelectedConnector(null);
      setShouldAutoSign(false); // Reset flag on error
    }
  };

  const isConnecting = isPending || selectedConnector !== null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-bold">
                  ERP GPLX
                </h1>
                <p className="text-cyan-200/80 text-sm">Bộ Công an Việt Nam</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mt-6">
              Hệ thống quản lý GPLX<br />
              trên Blockchain
            </h2>
            
            <p className="text-cyan-100/80 text-lg leading-relaxed">
              Kết nối ví điện tử của bạn để truy cập hệ thống quản lý GPLX, 
              đăng kiểm và vi phạm giao thông an toàn, minh bạch trên nền tảng Blockchain.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 pt-6">
            {[
              'Bảo mật tuyệt đối với công nghệ Blockchain',
              'Dữ liệu minh bạch, không thể thay đổi',
              'Truy cập nhanh chóng, mọi lúc mọi nơi',
              'Tích hợp đa ví điện tử'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-cyan-50/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Section - Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl bg-white/95 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Wallet className="h-6 w-6 text-cyan-600" />
                Kết nối ví điện tử
              </CardTitle>
              <CardDescription className="text-base">
                Chọn ví điện tử của bạn để đăng nhập vào hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayWallets.map((wallet, index) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-auto p-4 justify-start gap-4 relative group transition-all duration-300 cursor-pointer ${
                      selectedConnector === wallet.id && isConnecting
                        ? 'border-cyan-400 bg-cyan-50'
                        : 'hover:border-cyan-300 hover:bg-cyan-50/50'
                    }`}
                    onClick={() => handleConnectWallet(wallet)}
                    disabled={isConnecting}
                  >
                    <div className="text-3xl flex-shrink-0">{wallet.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base">{wallet.name}</span>
                        {wallet.popular && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full">
                            Phổ biến
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {wallet.description}
                      </p>
                    </div>
                    {selectedConnector === wallet.id && isConnecting ? (
                      <div className="flex items-center gap-2 text-cyan-600">
                        <div className="animate-spin h-5 w-5 border-2 border-cyan-600 border-t-transparent rounded-full"></div>
                        <span className="text-sm">Đang kết nối...</span>
                      </div>
                    ) : (
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-cyan-600 transition-colors" />
                    )}
                  </Button>
                </motion.div>
              ))}

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
              >
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      Bảo mật & Riêng tư
                    </p>
                    <p className="text-xs text-blue-700/80 leading-relaxed">
                      Chúng tôi không bao giờ yêu cầu khóa riêng tư của bạn. 
                      Tất cả giao dịch đều được mã hóa và bảo vệ bởi Blockchain.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Help Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center pt-4"
              >
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline inline-flex items-center gap-1"
                >
                  Chưa có ví điện tử? Tìm hiểu cách tạo ví
                  <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-cyan-100/60 text-sm mt-6"
          >
            Bằng việc kết nối ví, bạn đồng ý với{' '}
            <a href="#" className="text-cyan-300 hover:underline">Điều khoản sử dụng</a>
            {' '}và{' '}
            <a href="#" className="text-cyan-300 hover:underline">Chính sách bảo mật</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}