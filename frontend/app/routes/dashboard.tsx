import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "~/components/app-sidebar";
import { JobApplicationCard } from "~/components/job-application-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { SpinnerCustom } from "~/components/ui/spinner";
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentRoute="/dashboard" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <h2>Dashboard</h2>
        </header>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
