import { authClient } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { IconArrowRight, IconBolt, IconClock } from "@tabler/icons-react";

export const Route = createFileRoute("/_auth/app/")({
  component: RouteComponent,
});

type Activity = {
  id: string;
  label: string;
  detail: string;
  status: "success" | "pending" | "failed";
  time: string;
};

const recentActivity: Activity[] = [
  {
    id: "evt_1",
    label: "Signed in",
    detail: "Email OTP",
    status: "success",
    time: "Just now",
  },
  {
    id: "evt_2",
    label: "Billing portal",
    detail: "Opened customer portal",
    status: "pending",
    time: "2m ago",
  },
  {
    id: "evt_3",
    label: "Subscription",
    detail: "Plan check",
    status: "success",
    time: "10m ago",
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name ?? session?.user?.email ?? "";
  const greeting = userName ? `Welcome back, ${userName}` : "Welcome back";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{greeting}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/app/polar/subscriptions" })}
          >
            Manage subscription
            <IconArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={() => navigate({ to: "/app/polar/portal" })}>
            Open billing portal
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <CardDescription>Authentication & profile</CardDescription>
            </div>
            <IconBolt className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">Active</div>
            <div className="text-sm text-muted-foreground">
              Signed in with email OTP.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CardDescription>Plan & billing</CardDescription>
            </div>
            <IconClock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">—</div>
            <div className="text-sm text-muted-foreground">
              Visit Subscriptions to choose a plan.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Environment</CardTitle>
              <CardDescription>Worker runtime</CardDescription>
            </div>
            <Badge variant="secondary">Cloudflare</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">Ready</div>
            <div className="text-sm text-muted-foreground">
              SSR + API routes running in Workers.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest events in this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.detail}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "success"
                          ? "default"
                          : row.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {row.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
