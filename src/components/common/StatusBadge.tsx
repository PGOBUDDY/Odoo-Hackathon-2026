import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Available:
    "border-green-200 bg-green-50 text-green-700",
  "On Trip":
    "border-blue-200 bg-blue-50 text-blue-700",
  "In Shop":
    "border-amber-200 bg-amber-50 text-amber-700",
  Retired:
    "border-slate-200 bg-slate-100 text-slate-700",
  "Off Duty":
    "border-slate-200 bg-slate-100 text-slate-700",
  Suspended:
    "border-red-200 bg-red-50 text-red-700",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap",
        statusStyles[status],
      )}
    >
      {status}
    </Badge>
  );
}