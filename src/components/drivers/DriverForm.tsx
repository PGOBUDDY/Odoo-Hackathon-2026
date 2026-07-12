import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
  Driver,
  DriverFormData,
  DriverStatus,
} from "@/types/driver";

interface DriverFormProps {
  driver?: Driver | null;
  submitting: boolean;
  onSubmit: (data: DriverFormData) => Promise<void>;
  onCancel: () => void;
}

const initialData: DriverFormData = {
  name: "",
  license_number: "",
  license_category: "",
  license_expiry: "",
  contact_number: "",
  safety_score: 100,
  status: "Available",
};

export default function DriverForm({
  driver,
  submitting,
  onSubmit,
  onCancel,
}: DriverFormProps) {
  const [formData, setFormData] =
    useState<DriverFormData>(initialData);

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        license_number: driver.license_number,
        license_category: driver.license_category,
        license_expiry: driver.license_expiry,
        contact_number: driver.contact_number,
        safety_score: driver.safety_score,
        status: driver.status,
      });
    } else {
      setFormData(initialData);
    }
  }, [driver]);

  function updateField<K extends keyof DriverFormData>(
    field: K,
    value: DriverFormData[K],
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

    await onSubmit({
      ...formData,
      name: formData.name.trim(),
      license_number:
        formData.license_number.trim().toUpperCase(),
      license_category:
        formData.license_category.trim().toUpperCase(),
      contact_number: formData.contact_number.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Driver name</Label>

          <Input
            id="name"
            placeholder="Alex Johnson"
            value={formData.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">
            License number
          </Label>

          <Input
            id="license_number"
            placeholder="GJ02-20240012345"
            value={formData.license_number}
            onChange={(event) =>
              updateField(
                "license_number",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_category">
            License category
          </Label>

          <Select
            value={formData.license_category}
            onValueChange={(value) =>
         updateField("license_category", value ?? "")
}
            required
          >
            <SelectTrigger id="license_category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LMV">LMV</SelectItem>
              <SelectItem value="HMV">HMV</SelectItem>
              <SelectItem value="TRANS">
                Transport
              </SelectItem>
              <SelectItem value="HAZMAT">
                Hazardous Goods
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_expiry">
            License expiry
          </Label>

          <Input
            id="license_expiry"
            type="date"
            value={formData.license_expiry}
            onChange={(event) =>
              updateField(
                "license_expiry",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_number">
            Contact number
          </Label>

          <Input
            id="contact_number"
            type="tel"
            placeholder="9876543210"
            value={formData.contact_number}
            onChange={(event) =>
              updateField(
                "contact_number",
                event.target.value,
              )
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="safety_score">
            Safety score
          </Label>

          <Input
            id="safety_score"
            type="number"
            min="0"
            max="100"
            value={formData.safety_score}
            onChange={(event) =>
              updateField(
                "safety_score",
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
                value as DriverStatus,
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
              <SelectItem value="Off Duty">
                Off Duty
              </SelectItem>
              <SelectItem value="Suspended">
                Suspended
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

          {driver ? "Save changes" : "Add driver"}
        </Button>
      </DialogFooter>
    </form>
  );
}