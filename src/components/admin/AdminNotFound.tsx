import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/data-states/empty-state";

// Detail page for a mentor / student id that doesn't exist (any more).
export function AdminNotFound({
  title,
  backHref,
  backLabel,
}: {
  title: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <EmptyState
        icon={SearchX}
        title={title}
        description="It may have been deleted, or the link is wrong."
        action={
          <Button asChild variant="outline">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        }
      />
    </div>
  );
}
