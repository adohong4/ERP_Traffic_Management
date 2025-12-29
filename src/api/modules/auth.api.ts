import { ConnectWalletCredentials, LoginCredentials, AuthResponse, RegisterData } from '@/types/auth.types';
import { api, setAuthToken } from '../base/apiClient';
import { API_ENDPOINTS } from '../base/endpoints';
import type { User, ApiResponse } from '@/types';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';

const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  const loginData = response.data.data!;

  // Set auth token
  setAuthToken(loginData.token);

  // Save user to localStorage
  localStorage.setItem('auth_user', JSON.stringify(loginData.user));

  return loginData;
};

/**
 * Connect Wallet
 */
export const connectWallet = async (credentials: ConnectWalletCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    API_ENDPOINTS.AUTH.CONNECTWALLET,
    credentials
  );

  const loginData = response.data;

  // Set auth token
  setAuthToken(loginData.token);

  // Save user to localStorage
  localStorage.setItem('auth_user', JSON.stringify(loginData.user));

  return loginData;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('erp_logged_in');
  localStorage.removeItem('wallet_address');
  localStorage.removeItem('wallet_signature');
  localStorage.removeItem('wallet_nonce');

  if (isConnected) {
    try {
      await disconnect();
    } catch (err) {
      console.log('Logout disconnect handled:', err);
    }
  }

  toast.success('Đã đăng xuất thành công');
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    { refreshToken }
  );

  const tokenData = response.data.data!;

  // Update auth token
  setAuthToken(tokenData.token);

  // Update user in localStorage
  localStorage.setItem('auth_user', JSON.stringify(tokenData.user));

  return tokenData;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
  return response.data.data!;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.UPDATE_PROFILE,
    data
  );

  const updatedUser = response.data.data!;

  // Update user in localStorage
  localStorage.setItem('auth_user', JSON.stringify(updatedUser));

  return updatedUser;
};

// Export all functions
export const authApi = {
  login,
  logout,
  connectWallet,
  refreshToken,
  getCurrentUser,
  updateProfile,
};

export default authApi;
