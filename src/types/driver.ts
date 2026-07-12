export type DriverStatus =
  | "Available"
  | "On Trip"
  | "Off Duty"
  | "Suspended";

export interface Driver {
  id: string;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  contact_number: string;
  safety_score: number;
  status: DriverStatus;
  created_at: string;
}

export interface DriverFormData {
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  contact_number: string;
  safety_score: number;
  status: DriverStatus;
}
