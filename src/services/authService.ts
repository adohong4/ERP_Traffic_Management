import authApi from '@/api/modules/auth.api';
import type { LoginCredentials, ConnectWalletCredentials, AuthResponse } from '@/types/auth.types';
import type { User } from '@/types';

/**
 * Auth Service - xử lý logic authentication ở mức business
 */
export const authService = {
    /** Login by Identity */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return await authApi.login(credentials);
    },

    /** Connect Wallet */
    connectWallet: async (credentials: ConnectWalletCredentials): Promise<AuthResponse> => {
        return await authApi.connectWallet(credentials);
    },

    /** Logout */
    logout: async (): Promise<void> => {
        await authApi.logout();
    },

    /** get user current from localStorage */
    getCurrentUserFromStorage: (): User | null => {
        const userJson = localStorage.getItem('auth_user');
        return userJson ? JSON.parse(userJson) : null;
    },

    /** check login */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('auth_user');
    },
};

export default authService;