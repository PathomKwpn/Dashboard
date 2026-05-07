import { ErrorBoundary as REB, type FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));

/* ─── Fallback UIs ───────────────────────────────────────────────────────── */
const PageFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const err = toError(error);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 mb-5">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>

      <h2 className="text-[15px] font-590 text-foreground tracking-tight mb-1">
        Something went wrong
      </h2>
      <p className="text-[13px] text-muted-foreground/70 max-w-sm mb-6">
        This page crashed unexpectedly. Try refreshing or go back to the dashboard.
      </p>

      {import.meta.env.DEV && (
        <pre className="mb-6 w-full max-w-xl rounded-xl border border-red-500/20 bg-red-500/5
                        px-4 py-3 text-left text-[11px] font-mono text-red-400/80
                        overflow-x-auto whitespace-pre-wrap break-all">
          {err.message}
        </pre>
      )}

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={resetErrorBoundary} className="gap-2 text-[12px]">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
        <Button
          size="sm"
          className="gap-2 text-[12px]"
          onClick={() => { window.location.href = "/dashboard"; }}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

const GlobalFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const err = toError(error);
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 mb-6">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>

      <h1 className="text-xl font-590 text-foreground tracking-tight mb-2">
        Application Error
      </h1>
      <p className="text-[13px] text-muted-foreground/70 max-w-md mb-8">
        A critical error occurred and the application could not recover. Reload the page to continue.
      </p>

      {import.meta.env.DEV && (
        <pre className="mb-8 w-full max-w-2xl rounded-xl border border-red-500/20 bg-red-500/5
                        px-4 py-3 text-left text-[11px] font-mono text-red-400/80
                        overflow-x-auto whitespace-pre-wrap break-all">
          {err.stack ?? err.message}
        </pre>
      )}

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={resetErrorBoundary} className="gap-2 text-[12px]">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
        <Button size="sm" className="gap-2 text-[12px]" onClick={() => window.location.reload()}>
          <RefreshCw className="h-3.5 w-3.5" />
          Reload page
        </Button>
      </div>
    </div>
  );
};

/* ─── Exported wrappers ──────────────────────────────────────────────────── */
export const PageErrorBoundary = ({ children }: { children: ReactNode }) => (
  <REB
    FallbackComponent={PageFallback}
    onError={(e, info) => console.error("[PageErrorBoundary]", e, info.componentStack)}
  >
    {children}
  </REB>
);

export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => (
  <REB
    FallbackComponent={GlobalFallback}
    onError={(e, info) => console.error("[GlobalErrorBoundary]", e, info.componentStack)}
  >
    {children}
  </REB>
);
