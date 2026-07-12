import { supabase } from "@/services/supabase";
import type {
  Vehicle,
  VehicleFormData,
} from "@/types/vehicle";

export async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Vehicle[];
}

export async function createVehicle(
  vehicle: VehicleFormData,
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .insert(vehicle)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A vehicle with this registration number already exists.",
      );
    }

    throw new Error(error.message);
  }

  return data as Vehicle;
}

export async function updateVehicle(
  id: string,
  vehicle: VehicleFormData,
): Promise<Vehicle> {
  const { data, error } = await supabase
    .from("vehicles")
    .update(vehicle)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A vehicle with this registration number already exists.",
      );
    }

    throw new Error(error.message);
  }

  return data as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This vehicle cannot be deleted because it is connected to a trip, fuel log, expense, or maintenance record.",
      );
    }

    throw new Error(error.message);
  }
}
export async function getAvailableVehicles(): Promise<
  Vehicle[]
> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "Available")
    .order("registration_number");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Vehicle[];
}