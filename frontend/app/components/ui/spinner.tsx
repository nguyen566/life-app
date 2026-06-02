import { cn } from "~/lib/utils";
import { LoaderIcon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function SpinnerCustom() {
  return (
    <div className="flex justify-center items-center gap-4 w-screen h-screen">
      <Spinner className="size-12" />
    </div>
  );
}

export { Spinner, SpinnerCustom };
