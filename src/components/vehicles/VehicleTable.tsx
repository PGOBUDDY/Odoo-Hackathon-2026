import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import StatusBadge from "@/components/common/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Vehicle } from "@/types/vehicle";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => Promise<void>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center text-center">
        <div>
          <p className="font-medium">No vehicles found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first vehicle to begin managing the
            fleet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Odometer</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                {vehicle.registration_number}
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {vehicle.model || "No model"}
                  </p>
                </div>
              </TableCell>

              <TableCell>{vehicle.vehicle_type}</TableCell>

              <TableCell>
                {formatNumber(vehicle.max_load_capacity)} kg
              </TableCell>

              <TableCell>
                {formatNumber(vehicle.odometer)} km
              </TableCell>

              <TableCell>
                {formatCurrency(vehicle.acquisition_cost)}
              </TableCell>

              <TableCell>
                <StatusBadge status={vehicle.status} />
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Vehicle actions"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onEdit(vehicle)}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(event) =>
                            event.preventDefault()
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete vehicle?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This will permanently delete{" "}
                            {vehicle.registration_number}. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() =>
                              void onDelete(vehicle)
                            }
                          >
                            Delete vehicle
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}