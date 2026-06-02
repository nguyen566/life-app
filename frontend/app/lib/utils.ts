import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { JobApplicationCardInfo } from "~/components/job-application-card";
import type { JobApplicationResult, JobStatus } from "./client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum ExtraJobStatus {
  TOTAL = "Total",
}

export type ExtendedJobStatus = JobStatus | ExtraJobStatus;

export const getJobApplicationCardInfo = (
  applications: JobApplicationResult[],
  status: ExtendedJobStatus,
): JobApplicationCardInfo => {
  const value =
    status === ExtraJobStatus.TOTAL
      ? applications.length
      : applications.filter((app) => app.status === status).length;
  return {
    value,
    status,
  };
};
