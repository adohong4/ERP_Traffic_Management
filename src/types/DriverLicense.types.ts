export type LicenseStatus =
  | 'pending'
  | 'active'
  | 'expired'
  | 'pause'
  | 'revoke';

export interface DriverLicense {
  id: string;
  full_name: string;
  avatar?: string;
  dob: string; // YYYY-MM-DD
  identity_no: string;
  owner_address: string;
  owner_city: string;
  license_no: string;
  issue_date: string;
  expiry_date?: string | null;
  status: LicenseStatus;
  license_type: string; // A1, B1, B2, ...
  authority_id: string;
  issuing_authority: string;
  nationality: string;
  point: number;
  wallet_address?: string;
  on_blockchain: boolean;
  blockchain_txhash?: string;
  version: number;
  creator_id: string;
  modifier_id?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

// Response types
export interface PaginatedResponse<T> {
  total_count: number;
  total_pages: number;
  page: number;
  size: number;
  has_more: boolean;
  driver_licenses: T[];
}

export interface StatusDistributionItem {
  status: LicenseStatus;
  count: number;
}

export interface StatusDistribution {
  distribution: StatusDistributionItem[];
  total: number;
}

export interface LicenseTypeDistributionItem {
  license_type: string;
  count: number;
}

export interface LicenseTypeDistribution {
  distribution: LicenseTypeDistributionItem[];
  total: number;
}

export interface LicenseTypeDetail {
  license_type: string;
  total: number;
  by_status: StatusDistributionItem[];
}

export interface LicenseTypeDetailDistribution {
  distribution: LicenseTypeDetail[];
  grand_total: number;
}

export interface CityDetail {
  owner_city: string;
  total: number;
  by_status: { status: LicenseStatus; count: number }[];
}

export interface CityDetailDistribution {
  distribution: CityDetail[];
  grand_total: number;
}