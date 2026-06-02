import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { cn, type ExtendedJobStatus } from "~/lib/utils";

export interface JobApplicationCardInfo {
  value: number;
  status: ExtendedJobStatus;
}

export function JobApplicationCard({
  className,
  applicationInfo,
  ...props
}: { applicationInfo: JobApplicationCardInfo } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="max-w-52">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {applicationInfo.value}
          </CardTitle>
          <CardDescription>
            {applicationInfo.status}
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
