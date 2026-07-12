import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onMenuClick: () => void;
}

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/vehicles": "Vehicles",
  "/drivers": "Drivers",
  "/trips": "Trips",
  "/maintenance": "Maintenance",
  "/expenses": "Fuel & Expenses",
  "/reports": "Reports",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const title = titles[location.pathname] ?? "TransitOps";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage transport operations efficiently
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input className="pl-9" placeholder="Search..." />
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
        </Button>
      </div>
    </header>
  );
}