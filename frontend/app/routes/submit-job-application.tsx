import { SubmitJobApplicationForm } from "~/components/submit-job-application-form";
import { FileUploader } from "~/components/ui/fileuploader";
import SidebarLayout from "~/layouts/sidebar-layout";
import { APP_ROUTES } from "~/route-constants";

export default function SubmitJobApplicationPage() {
  return (
    <SidebarLayout
      currentRoute={APP_ROUTES.SUBMIT_JOB_APPLICATION}
      header="Submit Job Application"
      children={
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <SubmitJobApplicationForm />
            <FileUploader className="w-lg" />
        </div>
      }
    />
  );
}
