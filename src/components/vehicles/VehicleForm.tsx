import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Vehicle,
  VehicleFormData,
  VehicleStatus,
} from "@/types/vehicle";

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  submitting: boolean;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel: () => void;
}

const initialData: VehicleFormData = {
  registration_number: "",
  name: "",
  model: "",
  vehicle_type: "",
  max_load_capacity: 0,
  odometer: 0,
  acquisition_cost: 0,
  status: "Available",
};

export default function VehicleForm({
  vehicle,
  submitting,
  onSubmit,
  onCancel,
}: VehicleFormProps) {
  const [formData, setFormData] =
    useState<VehicleFormData>(initialData);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registration_number: vehicle.registration_number,
        name: vehicle.name,
        model: vehicle.model ?? "",
        vehicle_type: vehicle.vehicle_type,
        max_load_capacity: vehicle.max_load_capacity,
        odometer: vehicle.odometer,
        acquisition_cost: vehicle.acquisition_cost,
        status: vehicle.status,
      });
    } else {
      setFormData(initialData);
    }
  }, [vehicle]);

  function updateField<K extends keyof VehicleFormData>(
    field: K,
    value: VehicleFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (formData.max_load_capacity <= 0) {
      return;
    }

    await onSubmit({
      ...formData,
      registration_number:
        formData.registration_number.trim().toUpperCase(),
      name: formData.name.trim(),
      model: formData.model.trim(),
      vehicle_type: formData.vehicle_type.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="registration_number">
            Registration number
          </Label>

          <Input
            id="registration_number"
            placeholder="GJ-02-AB-1234"
            value={formData.registration_number}
            onChange={(event) =>
              updateField(
                "registration_number",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Vehicle name</Label>

          <Input
            id="name"
            placeholder="Van-05"
            value={formData.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>

          <Input
            id="model"
            placeholder="Tata Ace"
            value={formData.model}
            onChange={(event) =>
              updateField("model", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle_type">
            Vehicle type
          </Label>

          <Select
            value={formData.vehicle_type}
            onValueChange={(value) =>
              updateField("vehicle_type", value)
            }
            required
          >
            <SelectTrigger id="vehicle_type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Mini Truck">
                Mini Truck
              </SelectItem>
              <SelectItem value="Tanker">Tanker</SelectItem>
              <SelectItem value="Trailer">Trailer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_load_capacity">
            Maximum capacity (kg)
          </Label>

          <Input
            id="max_load_capacity"
            type="number"
            min="1"
            step="0.01"
            value={formData.max_load_capacity || ""}
            onChange={(event) =>
              updateField(
                "max_load_capacity",
                Number(event.target.value),
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="odometer">
            Odometer (km)
          </Label>

          <Input
            id="odometer"
            type="number"
            min="0"
            step="0.01"
            value={formData.odometer}
            onChange={(event) =>
              updateField(
                "odometer",
                Number(event.target.value),
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acquisition_cost">
            Acquisition cost (₹)
          </Label>

          <Input
            id="acquisition_cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.acquisition_cost}
            onChange={(event) =>
              updateField(
                "acquisition_cost",
                Number(event.target.value),
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={formData.status}
            onValueChange={(value) =>
              updateField(
                "status",
                value as VehicleStatus,
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Available">
                Available
              </SelectItem>
              <SelectItem value="On Trip">
                On Trip
              </SelectItem>
              <SelectItem value="In Shop">
                In Shop
              </SelectItem>
              <SelectItem value="Retired">
                Retired
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting && (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          )}

          {vehicle ? "Save changes" : "Add vehicle"}
        </Button>
      </DialogFooter>
    </form>
  );
}