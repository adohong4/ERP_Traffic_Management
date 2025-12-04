import { api, setAuthToken } from '../base/apiClient';
import { API_ENDPOINTS } from '../base/endpoints';
import type { User, ApiResponse } from '@/types';

/**
 * Auth API Module
 * 
 * Handles all authentication-related API calls
 */

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
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
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local auth data regardless of API call result
    setAuthToken(null);
    localStorage.removeItem('auth_user');
  }
};

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  
  const registerData = response.data.data!;
  
  // Set auth token
  setAuthToken(registerData.token);
  
  // Save user to localStorage
  localStorage.setItem('auth_user', JSON.stringify(registerData.user));
  
  return registerData;
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
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

/**
 * Change password
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
};

// Export all functions
export const authApi = {
  login,
  logout,
  register,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

export default authApi;
