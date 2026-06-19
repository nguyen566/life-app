import { useQuery } from "@tanstack/react-query";
import { JobApplicationCard } from "~/components/job-application-card";
import { JobsTable } from "~/components/jobs-table";
import { SpinnerCustom } from "~/components/ui/spinner";
import SidebarLayout from "~/layouts/sidebar-layout";
import api from "~/lib/api";
import { JobStatus } from "~/lib/client";
import { ExtraJobStatus, getJobApplicationCardInfo } from "~/lib/utils";
import { APP_ROUTES } from "~/routes";

export default function DashboardPage() {
  const { isLoading, data } = useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      const { data } = await api.jobsApplied.getJobsAppliedJobsAppliedGet({
        secure: true,
      });
      return data;
    },
  });

  return (
    <SidebarLayout
      currentRoute={APP_ROUTES.DASHBOARD}
      header="Dashboard"
      children={
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <SpinnerCustom />
          ) : (
            <>
              <div className="flex flex-col md:flex-row  gap-4">
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    ExtraJobStatus.TOTAL,
                  )}
                  className="flex-1"
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Applied,
                  )}
                  className="flex-1"
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Interviewing,
                  )}
                  className="flex-1"
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Rejected,
                  )}
                  className="flex-1"
                />
              </div>
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <JobsTable jobs={data ?? []} />
              </div>
            </>
          )}
        </div>
      }
    />
  );
}
