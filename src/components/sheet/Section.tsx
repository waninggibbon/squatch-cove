import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/warcraftcn/card";
import { cn } from "@/lib/utils";

/**
 * A themed section built from the warcraftcn Card primitives. The Card parts
 * (CardHeader's top ornament clearance, CardContent padding) are what keep
 * content clear of the textured border-image frame — so we compose them as the
 * library intends rather than hand-rolling padding.
 */
export function Section({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="fantasy text-amber-100">{title}</CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3 pb-8")}>
        {children}
      </CardContent>
    </Card>
  );
}
