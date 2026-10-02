import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Full-page message card for booking/enquiry pages that can't show their form.
export default function Notice({
  title,
  children,
  backHref,
  backLabel,
}: {
  title: string;
  children: React.ReactNode;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Card className="max-w-md w-full border-slate-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="text-slate-600">{children}</div>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
