import { authClient } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import Dashboard01Block from "@workspace/ui/components/dashboard-01";
import { IconArrowRight } from "@tabler/icons-react";

export const Route = createFileRoute("/_auth/app/")({
  component: RouteComponent,
});

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

      <Dashboard01Block />
    </div>
  );
}
