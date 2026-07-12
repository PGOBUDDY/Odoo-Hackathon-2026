import { supabase } from "@/services/supabase";
import type {
  CompleteTripData,
  Trip,
  TripFormData,
} from "@/types/trip";

const tripQuery = `
  *,
  vehicles (
    id,
    registration_number,
    name,
    model,
    vehicle_type,
    max_load_capacity,
    odometer,
    acquisition_cost,
    status,
    created_at
  ),
  drivers (
    id,
    name,
    license_number,
    license_category,
    license_expiry,
    contact_number,
    safety_score,
    status,
    created_at
  )
`;

export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select(tripQuery)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as Trip[];
}

export async function createTrip(
  trip: TripFormData,
): Promise<void> {
  const { data: vehicle, error: vehicleError } =
    await supabase
      .from("vehicles")
      .select("status, max_load_capacity")
      .eq("id", trip.vehicle_id)
      .single();

  if (vehicleError) {
    throw new Error(vehicleError.message);
  }

  if (vehicle.status !== "Available") {
    throw new Error("The selected vehicle is not available.");
  }

  if (trip.cargo_weight > vehicle.max_load_capacity) {
    throw new Error(
      `Cargo exceeds the vehicle capacity of ${vehicle.max_load_capacity} kg.`,
    );
  }

  const { data: driver, error: driverError } =
    await supabase
      .from("drivers")
      .select("status, license_expiry")
      .eq("id", trip.driver_id)
      .single();

  if (driverError) {
    throw new Error(driverError.message);
  }

  if (driver.status !== "Available") {
    throw new Error("The selected driver is not available.");
  }

  const expiryDate = new Date(
    `${driver.license_expiry}T23:59:59`,
  );

  if (expiryDate < new Date()) {
    throw new Error(
      "The selected driver's license has expired.",
    );
  }

  const { error } = await supabase.from("trips").insert({
    ...trip,
    source: trip.source.trim(),
    destination: trip.destination.trim(),
    status: "Draft",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateTrip(
  id: string,
  trip: TripFormData,
): Promise<void> {
  const { error } = await supabase
    .from("trips")
    .update({
      ...trip,
      source: trip.source.trim(),
      destination: trip.destination.trim(),
    })
    .eq("id", id)
    .eq("status", "Draft");

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase
    .from("trips")
    .delete()
    .eq("id", id)
    .eq("status", "Draft");

  if (error) {
    throw new Error(error.message);
  }
}

export async function dispatchTrip(
  id: string,
): Promise<void> {
  const { error } = await supabase.rpc("dispatch_trip", {
    p_trip_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeTrip(
  id: string,
  values: CompleteTripData,
): Promise<void> {
  const { error } = await supabase.rpc("complete_trip", {
    p_trip_id: id,
    p_final_odometer: values.final_odometer,
    p_actual_distance: values.actual_distance,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function cancelTrip(
  id: string,
): Promise<void> {
  const { error } = await supabase.rpc("cancel_trip", {
    p_trip_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}