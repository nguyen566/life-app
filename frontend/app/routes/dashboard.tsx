import { useQuery } from "@tanstack/react-query";
import { JobApplicationCard } from "~/components/job-application-card";
import { SpinnerCustom } from "~/components/ui/spinner";
import SidebarLayout from "~/layouts/sidebar-layout";
import api from "~/lib/api";
import { JobStatus } from "~/lib/client";
import { ExtraJobStatus, getJobApplicationCardInfo } from "~/lib/utils";

export default function DashboardPage() {
  const { isLoading, data } = useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      const { data } = await api.jobsApplied.getJobsAppliedJobsAppliedGet();
      return data;
    },
  });

  return (
    <SidebarLayout
      currentRoute="/dashboard"
      header="Dashboard"
      children={
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading ? (
            <SpinnerCustom />
          ) : (
            <>
              <div className="grid auto-rows-min gap-1 md:grid-cols-4">
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    ExtraJobStatus.TOTAL,
                  )}
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Applied,
                  )}
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Interviewing,
                  )}
                />
                <JobApplicationCard
                  applicationInfo={getJobApplicationCardInfo(
                    data ?? [],
                    JobStatus.Rejected,
                  )}
                />
              </div>
              <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <h2>Job Application Table Goes Here</h2>
              </div>
            </>
          )}
        </div>
      }
    />
  );
}
