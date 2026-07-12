import type { Driver } from "@/types/driver";
import type { Vehicle } from "@/types/vehicle";

export type TripStatus =
  | "Draft"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicle_id: string;
  driver_id: string;
  cargo_weight: number;
  planned_distance: number;
  actual_distance: number | null;
  revenue: number;
  final_odometer: number | null;
  status: TripStatus;
  dispatched_at: string | null;
  completed_at: string | null;
  created_at: string;

  vehicles?: Vehicle | null;
  drivers?: Driver | null;
}

export interface TripFormData {
  source: string;
  destination: string;
  vehicle_id: string;
  driver_id: string;
  cargo_weight: number;
  planned_distance: number;
  revenue: number;
}

export interface CompleteTripData {
  final_odometer: number;
  actual_distance: number;
}