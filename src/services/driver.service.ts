import { supabase } from "@/services/supabase";
import type {
  Driver,
  DriverFormData,
} from "@/types/driver";

export async function getDrivers(): Promise<Driver[]> {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Driver[];
}

export async function createDriver(
  driver: DriverFormData,
): Promise<Driver> {
  const { data, error } = await supabase
    .from("drivers")
    .insert(driver)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A driver with this license number already exists.",
      );
    }

    throw new Error(error.message);
  }

  return data as Driver;
}

export async function updateDriver(
  id: string,
  driver: DriverFormData,
): Promise<Driver> {
  const { data, error } = await supabase
    .from("drivers")
    .update(driver)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(
        "A driver with this license number already exists.",
      );
    }

    throw new Error(error.message);
  }

  return data as Driver;
}

export async function deleteDriver(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from("drivers")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This driver cannot be deleted because they are connected to an existing trip.",
      );
    }

    throw new Error(error.message);
  }
}
export async function getAvailableDrivers(): Promise<
  Driver[]
> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("status", "Available")
    .gte("license_expiry", today)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Driver[];
}