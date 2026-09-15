import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { WidgetCard } from "@/components/WidgetCard";

/** Isolates a widget so a render crash shows a small fallback instead of blanking the new tab. */
export function WidgetBoundary({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error) => console.error(`${name} widget crashed`, error)}
      fallbackRender={({ resetErrorBoundary }) => (
        <WidgetCard role="alert" aria-label={name} className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">{name} couldn&apos;t be displayed.</p>
          <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
            Reload widget
          </Button>
        </WidgetCard>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
