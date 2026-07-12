import {
  AlertTriangle,
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Driver } from "@/types/driver";

interface DriverTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => Promise<void>;
}

function getLicenseStatus(expiryDate: string) {
  const expiry = new Date(`${expiryDate}T00:00:00`);
  const today = new Date();

  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil(
    (expiry.getTime() - today.getTime()) /
      millisecondsPerDay,
  );

  if (daysRemaining < 0) {
    return {
      label: "Expired",
      warning: true,
    };
  }

  if (daysRemaining <= 30) {
    return {
      label: `${daysRemaining} days left`,
      warning: true,
    };
  }

  return {
    label: expiry.toLocaleDateString("en-IN"),
    warning: false,
  };
}

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
}: DriverTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center text-center">
        <div>
          <p className="font-medium">No drivers found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first driver to begin managing the team.
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
            <TableHead>Driver</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Safety score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {drivers.map((driver) => {
            const licenseStatus = getLicenseStatus(
              driver.license_expiry,
            );

            return (
              <TableRow key={driver.id}>
                <TableCell>
                  <p className="font-medium">{driver.name}</p>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">
                      {driver.license_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {driver.license_category}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div
                    className={
                      licenseStatus.warning
                        ? "flex items-center gap-2 text-destructive"
                        : ""
                    }
                  >
                    {licenseStatus.warning && (
                      <AlertTriangle className="size-4" />
                    )}

                    <span>{licenseStatus.label}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {driver.contact_number}
                </TableCell>

                <TableCell>
                  <div className="min-w-28 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{driver.safety_score}/100</span>
                    </div>

                    <Progress
                      value={driver.safety_score}
                      className="h-2"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={driver.status} />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Driver actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(driver)}
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
                              Delete driver?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              This will permanently delete{" "}
                              {driver.name}. This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                void onDelete(driver)
                              }
                            >
                              Delete driver
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}