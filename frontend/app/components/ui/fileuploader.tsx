import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { FilePondErrorDescription, FilePondFile } from "filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { toast } from "sonner";
import api from "~/lib/api";
import { getUploadTemplate } from "~/lib/get-upload-template";
import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { Spinner } from "./spinner";

registerPlugin(FilePondPluginFileValidateType);

function FileUploader({ className, ...props }: React.ComponentProps<"div">) {
  const [hasError, setHasError] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const converPondFile = (pondFile: FilePondFile[]) => {
    const nativeFile = pondFile.map((x) => x.file) as File[];
    setFiles(nativeFile);
  };

  const handleError = (err: FilePondErrorDescription | null) => {
    if (err) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  const uploadFile = async () => {
    if (!files[0]) return;
    const { data } = await api.jobsApplied.uploadFileJobsAppliedUploadPost(
      {
        file: files[0], // send the File/Blob directly
      },
      { secure: true },
    );
    return data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.info("File successfully uploaded");
    },
    onError: (error) => {
      let errorMsg = "An unexpected error has occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        const resMessage = error?.response?.data?.detail;
        if (resMessage) {
          errorMsg = resMessage;
        }
      }

      toast.error(errorMsg);
    },
    onSettled: () => {
      setFiles([]);
    },
  });

  return (
    <>
      <Accordion type="single" collapsible className="max-w-lg">
        <AccordionItem value="upload">
          <AccordionTrigger>Want to do a bulk upload?</AccordionTrigger>
          <AccordionContent className="h-fit flex flex-col gap-4">
            <div className="flex justify-end">
              <Button
              type="button"
              className="rounded-full"
              onClick={getUploadTemplate}
            >
              Download Template
            </Button>
            </div>
            <FilePond
              className={cn(className)}
              files={files}
              onupdatefiles={converPondFile}
              onaddfile={handleError}
              allowMultiple={false}
              maxFiles={1}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              allowFileTypeValidation={true}
              acceptedFileTypes={[
                "text/csv",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ]}
            />
            <Button
              type="button"
              className="rounded-full w-lg"
              disabled={hasError || files.length === 0 || isPending}
              onClick={() => mutate()}
            >
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              Upload
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export { FileUploader };

