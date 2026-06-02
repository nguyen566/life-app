import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import api from "~/lib/api";
import type { JobApplicationCreate } from "~/lib/client";
import { cn } from "~/lib/utils";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

export function SubmitJobApplicationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const queryClient = useQueryClient();

  const createJobApplication = async (application: JobApplicationCreate) => {
    const { data } =
      await api.jobsApplied.createJobApplicationJobsAppliedPost(application);

    return data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createJobApplication,
    onSuccess: () => {
      form.reset();
      toast.success("Job application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
    },
    onError: () => {
      toast.error("Failed to submit job application. Please try again.");
    },
  });

  const formSchema = z.object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    site: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      company: "",
      position: "",
      site: "",
    },
  });

  const submitApplication = (data: z.infer<typeof formSchema>) => {
    const job_application: JobApplicationCreate = {
      ...data,
    };
    toast.info("Submitting...");
    mutate(job_application);
  };

  return (
    <form
      id="job-application-form"
      className="flex flex-col max-w-xs gap-4"
      onSubmit={form.handleSubmit(submitApplication)}
    >
      <FieldGroup>
        <Controller
          name="company"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="company">Company</FieldLabel>
              <Input
                {...field}
                id="company"
                aria-invalid={fieldState.invalid}
                placeholder="Name of the company"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="position"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="position">Position</FieldLabel>
              <Input
                {...field}
                id="position"
                aria-invalid={fieldState.invalid}
                placeholder="Position for job"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="site"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="site">Site</FieldLabel>
              <Input
                {...field}
                id="site"
                aria-invalid={fieldState.invalid}
                placeholder="Site used to apply"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Field className="justify-end" orientation="horizontal">
        <Button
          disabled={isPending}
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button disabled={isPending} type="submit" form="job-application-form">
          Submit
        </Button>
      </Field>
    </form>
  );
}
