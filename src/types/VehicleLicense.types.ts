export interface VehicleRegistration {
  id: string;
  owner_id?: string;
  brand: string;
  type_vehicle: string;
  vehicle_no: string;
  color_plate: string;
  chassis_no: string;
  engine_no: string;
  color_vehicle: string;
  owner_name: string;
  seats?: number;
  issue_date: string;
  issuer: string;
  registration_date?: string;
  expiry_date?: string;
  registration_place?: string;
  on_blockchain: boolean;
  blockchain_txhash: string;
  status: string;
  version: number;
  creator_id: string;
  modifier_id?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface VehicleRegistrationList {
  total_count: number;
  total_pages: number;
  page: number;
  size: number;
  has_more: boolean;
  vehicle_registration: VehicleRegistration[];
}

export interface PaginatedResponse<T> {
  total_count: number;
  total_pages: number;
  page: number;
  size: number;
  has_more: boolean;
  vehicle_registration: T[];
}

export interface CountItem {
  key: string;
  count: number;
}

export type VehicleTypeStats = CountItem[];
export type VehicleBrandStats = CountItem[];
export type VehicleStatusStats = CountItem[];