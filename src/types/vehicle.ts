export type VehicleStatus =
  | "Available"
  | "On Trip"
  | "In Shop"
  | "Retired";

export interface Vehicle {
  id: string;
  registration_number: string;
  name: string;
  model: string | null;
  vehicle_type: string;
  max_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
  created_at: string;
}

export interface VehicleFormData {
  registration_number: string;
  name: string;
  model: string;
  vehicle_type: string;
  max_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
}