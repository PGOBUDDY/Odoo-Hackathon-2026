import {
  BarChart3,
  Bus,
  Fuel,
  Gauge,
  LayoutDashboard,
  LogOut,
  Route,
  Users,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navigationItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Vehicles", path: "/vehicles", icon: Bus },
  { label: "Drivers", path: "/drivers", icon: Users },
  { label: "Trips", path: "/trips", icon: Route },
  { label: "Maintenance", path: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", path: "/expenses", icon: Fuel },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { profile, user, signOut } = useAuth();

  const content = (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Gauge className="size-5" />
        </div>

        <div>
          <h1 className="font-semibold">TransitOps</h1>
          <p className="text-xs text-muted-foreground">
            Transport Management
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <p className="truncate text-sm font-medium">
          {profile?.full_name ?? user?.email}
        </p>

        <p className="mb-3 truncate text-xs capitalize text-muted-foreground">
          {profile?.role?.replaceAll("_", " ") ?? "User"}
        </p>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => void signOut()}
        >
          <LogOut className="mr-2 size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden h-screen lg:block">{content}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />

          <div className="relative h-full w-64">{content}</div>
        </div>
      )}
    </>
  );
}