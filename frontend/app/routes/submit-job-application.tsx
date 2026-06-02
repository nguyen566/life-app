import { SubmitJobApplicationForm } from "~/components/submit-job-application-form";
import SidebarLayout from "~/layouts/sidebar-layout";
import { APP_ROUTES } from "~/routes";

export default function SubmitJobApplicationPage() {
  return (
    <SidebarLayout
      currentRoute={APP_ROUTES.SUBMIT_JOB_APPLICATION}
      header="Submit Job Application"
      children={
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SubmitJobApplicationForm />
        </div>
      }
    />
  );
}
