import {
  Bus,
  CircleDollarSign,
  Route,
  Users,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cards = [
  {
    title: "Total Vehicles",
    value: "0",
    description: "Vehicles in your fleet",
    icon: Bus,
  },
  {
    title: "Available Drivers",
    value: "0",
    description: "Drivers ready for dispatch",
    icon: Users,
  },
  {
    title: "Active Trips",
    value: "0",
    description: "Trips currently in progress",
    icon: Route,
  },
  {
    title: "In Maintenance",
    value: "0",
    description: "Vehicles currently in shop",
    icon: Wrench,
  },
  {
    title: "Operating Cost",
    value: "₹0",
    description: "Fuel and maintenance cost",
    icon: CircleDollarSign,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Operations overview
        </h1>

        <p className="text-muted-foreground">
          Monitor fleet, drivers, trips and expenses.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent trips</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              No trips have been created yet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations alerts</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              No active alerts.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}