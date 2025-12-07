import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Wallet, Shield, Lock, CheckCircle, ExternalLink } from "lucide-react";
import { useWalletLogin } from "@/hooks/useWalletAuth";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const {
    displayWallets,
    handleConnectWallet,
    isConnecting,
    selectedConnector,
  } = useWalletLogin({ onLogin });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
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
              Hệ thống quản lý GPLX
              <br />
              trên Blockchain
            </h2>

            <p className="text-cyan-100/80 text-lg leading-relaxed">
              Kết nối ví điện tử của bạn để truy cập hệ thống quản lý GPLX, đăng
              kiểm và vi phạm giao thông an toàn, minh bạch trên nền tảng
              Blockchain.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            {[
              "Bảo mật tuyệt đối với công nghệ Blockchain",
              "Dữ liệu minh bạch, không thể thay đổi",
              "Truy cập nhanh chóng, mọi lúc mọi nơi",
              "Tích hợp đa ví điện tử",
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
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
              {displayWallets.map((wallet, i) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-auto p-4 justify-start gap-4 relative group transition-all duration-300 ${selectedConnector === wallet.id && isConnecting
                      ? "border-cyan-400 bg-cyan-50"
                      : "hover:border-cyan-300 hover:bg-cyan-50/50"
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
                      <p className="text-sm text-muted-foreground mt-0.5">{wallet.description}</p>
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

              {/* === NÚT ĐĂNG NHẬP DEMO === */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">Hoặc</span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    const demoAddress = "0x335145400C12958600C0542F9180e03B917F7BbB";
                    localStorage.setItem("wallet_address", demoAddress);
                    localStorage.setItem("wallet_signature", "0x6d9b8516ce9c75ff9b795e202b38034d94c94e380939dbdd2f74d686f492ff6c4c9dd3f14179675f7a1bcee7c6c3c178dd125aa2d320e60f3afe3aceb85d57891c");
                    localStorage.setItem("wallet_nonce", "999999");
                    // localStorage.setItem("isDemo", "true"); // Đánh dấu là demo (tùy chọn)

                    toast.success(`Chào mừng! Bạn đang dùng chế độ Demo`);
                    setTimeout(onLogin, 600);
                  }}
                  variant="outline"
                  className="w-full mt-6 border-2 border-dashed border-cyan-400 hover:border-cyan-500 hover:bg-cyan-50 text-cyan-700 font-semibold text-lg py-6 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  <span className="ml-3">Đăng nhập (Demo)</span>
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
                  Xem trước toàn bộ giao diện hệ thống quản lý GPLX • Không cần ví • Dữ liệu chỉ mang tính minh họa
                </p>
              </motion.div>
              {/* === HẾT NÚT DEMO === */}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
              >
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">Bảo mật & Riêng tư</p>
                    <p className="text-xs text-blue-700/80 leading-relaxed">
                      Chúng tôi không bao giờ yêu cầu khóa riêng tư của bạn. Tất cả giao dịch đều được mã hóa và bảo vệ bởi Blockchain.
                    </p>
                  </div>
                </div>
              </motion.div>

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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-cyan-100/60 text-sm mt-6"
          >
            Bằng việc kết nối ví, bạn đồng ý với{" "}
            <a href="#" className="text-cyan-300 hover:underline">Điều khoản sử dụng</a> và{" "}
            <a href="#" className="text-cyan-300 hover:underline">Chính sách bảo mật</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}