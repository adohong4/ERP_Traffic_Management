import { User } from ".";

export interface LoginCredentials {
    identity_no: string;
}

export interface ConnectWalletCredentials {
    user_address: string;
}

export interface AuthResponse {
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