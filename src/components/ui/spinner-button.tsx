import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton({ buttonName }: { buttonName: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        {buttonName && buttonName}
      </Button>
    </div>
  );
}
