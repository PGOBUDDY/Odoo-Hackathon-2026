import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LoaderCircle,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import VehicleForm from "@/components/vehicles/VehicleForm";
import VehicleTable from "@/components/vehicles/VehicleTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "@/services/vehicle.service";
import type {
  Vehicle,
  VehicleFormData,
} from "@/types/vehicle";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);
  const [search, setSearch] = useState("");

  const loadVehicles = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load vehicles",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return vehicles;
    }

    return vehicles.filter((vehicle) =>
      [
        vehicle.registration_number,
        vehicle.name,
        vehicle.model ?? "",
        vehicle.vehicle_type,
        vehicle.status,
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [vehicles, search]);

  function openAddDialog() {
    setSelectedVehicle(null);
    setDialogOpen(true);
  }

  function openEditDialog(vehicle: Vehicle) {
    setSelectedVehicle(vehicle);
    setDialogOpen(true);
  }

  async function handleSubmit(data: VehicleFormData) {
    setSubmitting(true);

    try {
      if (selectedVehicle) {
        const updated = await updateVehicle(
          selectedVehicle.id,
          data,
        );

        setVehicles((current) =>
          current.map((vehicle) =>
            vehicle.id === updated.id ? updated : vehicle,
          ),
        );

        toast.success("Vehicle updated successfully");
      } else {
        const created = await createVehicle(data);

        setVehicles((current) => [created, ...current]);

        toast.success("Vehicle added successfully");
      }

      setDialogOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save vehicle",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    try {
      await deleteVehicle(vehicle.id);

      setVehicles((current) =>
        current.filter((item) => item.id !== vehicle.id),
      );

      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete vehicle",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vehicles
          </h1>

          <p className="text-muted-foreground">
            Register and manage all vehicles in your fleet.
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus className="mr-2 size-4" />
          Add vehicle
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search vehicles..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <VehicleTable
              vehicles={filteredVehicles}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!submitting) {
            setDialogOpen(open);

            if (!open) {
              setSelectedVehicle(null);
            }
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle
                ? "Edit vehicle"
                : "Add vehicle"}
            </DialogTitle>

            <DialogDescription>
              {selectedVehicle
                ? "Update the vehicle information below."
                : "Enter the details of the new fleet vehicle."}
            </DialogDescription>
          </DialogHeader>

          <VehicleForm
            vehicle={selectedVehicle}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}