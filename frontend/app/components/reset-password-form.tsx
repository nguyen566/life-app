import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
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
import { cn } from "~/lib/utils";
import { Spinner } from "./ui/spinner";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const formSchema = z.object({
    password: z.string().min(8, "Please enter a minimum of 8 characters"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
  });

  const resetPassword = async (password: string) => {
    const { data } = await api.user.resetPasswordUserResetPasswordPost(
      {
        token: token as string,
      },
      {
        password,
      },
    );

    return data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.info("Password has successfully been reset.");
    },
    onError: (error) => {
      let errorMsg = "An unexpected error has occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        const resMessage = error?.response?.data?.detail;
        if (resMessage) {
          errorMsg = resMessage;
        }
      }

      toast.error("An unexpected error has occurred. Please try again.");
    },
    onSettled: () => {
      navigate("/login");
    },
  });

  const submitReset = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    mutate(data.password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>Enter a new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="password-reset-form"
            className="flex flex-col max-w-xs gap-4"
            onSubmit={form.handleSubmit(submitReset)}
          >
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                disabled={isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      name="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="New password"
                      autoComplete="new-password"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-full"
                  disabled={isPending}
                  form="password-reset-form"
                >
                  {isPending ? <Spinner data-icon="inline-start" /> : null}
                  Reset Password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
