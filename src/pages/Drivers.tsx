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

import DriverForm from "@/components/drivers/DriverForm";
import DriverTable from "@/components/drivers/DriverTable";
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
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "@/services/driver.service";
import type {
  Driver,
  DriverFormData,
} from "@/types/driver";

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] =
    useState<Driver | null>(null);
  const [search, setSearch] = useState("");

  const loadDrivers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load drivers",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDrivers();
  }, [loadDrivers]);

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return drivers;
    }

    return drivers.filter((driver) =>
      [
        driver.name,
        driver.license_number,
        driver.license_category,
        driver.contact_number,
        driver.status,
      ].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [drivers, search]);

  function openAddDialog() {
    setSelectedDriver(null);
    setDialogOpen(true);
  }

  function openEditDialog(driver: Driver) {
    setSelectedDriver(driver);
    setDialogOpen(true);
  }

  async function handleSubmit(data: DriverFormData) {
    setSubmitting(true);

    try {
      if (selectedDriver) {
        const updated = await updateDriver(
          selectedDriver.id,
          data,
        );

        setDrivers((current) =>
          current.map((driver) =>
            driver.id === updated.id ? updated : driver,
          ),
        );

        toast.success("Driver updated successfully");
      } else {
        const created = await createDriver(data);

        setDrivers((current) => [created, ...current]);

        toast.success("Driver added successfully");
      }

      setDialogOpen(false);
      setSelectedDriver(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save driver",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(driver: Driver) {
    try {
      await deleteDriver(driver.id);

      setDrivers((current) =>
        current.filter((item) => item.id !== driver.id),
      );

      toast.success("Driver deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete driver",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Drivers
          </h1>

          <p className="text-muted-foreground">
            Manage drivers, licenses, safety scores, and
            availability.
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus className="mr-2 size-4" />
          Add driver
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search drivers..."
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
            <DriverTable
              drivers={filteredDrivers}
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
              setSelectedDriver(null);
            }
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDriver
                ? "Edit driver"
                : "Add driver"}
            </DialogTitle>

            <DialogDescription>
              {selectedDriver
                ? "Update the driver information below."
                : "Enter the details of the new driver."}
            </DialogDescription>
          </DialogHeader>

          <DriverForm
            driver={selectedDriver}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}