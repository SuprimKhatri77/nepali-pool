import { CheckCircle2 } from "lucide-react";

export function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <p className="text-sm">{children}</p>
    </div>
  );
}
