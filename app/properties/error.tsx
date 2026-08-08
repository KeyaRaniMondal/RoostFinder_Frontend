"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-xl font-bold text-foreground">Could not load properties</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Something went wrong while fetching properties."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        <RotateCcw className="h-4 w-4" /> Try again
      </button>
    </div>
  );
}
