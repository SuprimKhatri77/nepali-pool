import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/lib/utils";

// Dashboard building blocks shared by the mentor and admin overviews.

export function StatCard({
  href,
  label,
  value,
  icon: Icon,
  hint,
  hintIcon: HintIcon,
}: {
  href?: string;
  label: string;
  value: number;
  icon: LucideIcon;
  hint: string;
  hintIcon?: LucideIcon;
}) {
  const card = (
    <Card
      className={cn(
        "h-full border-slate-200 py-0 transition-shadow",
        href && "hover:shadow-md",
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-gray-500">
            {HintIcon && <HintIcon className="mt-px size-3 shrink-0" />}
            <span>{hint}</span>
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link
      href={href}
      className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {card}
    </Link>
  ) : (
    card
  );
}

const tones = {
  amber: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100/70",
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100/70",
  slate: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
};

export function AttentionLink({
  href,
  icon: Icon,
  tone,
  text,
  cta,
}: {
  href: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
  text: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors",
        tones[tone],
      )}
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        <Icon className="size-5 shrink-0" />
        {text}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
        {cta}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}
