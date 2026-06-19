import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import api from "~/lib/api";
import type { CommonHTTPResponse, UserInput } from "~/lib/client";
import { APP_ROUTES } from "~/route-constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState(`Unfortunately, there was an error creating your account. Please
              try again.`);

  const navigateToLogin = () => {
    navigate(APP_ROUTES.LOGIN);
  };

  const createUser = async (userInfo: UserInput) => {
    const { data } = await api.user.registerUserUserRegisterPost(userInfo);
    return data;
  };

  const { isPending, mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setOpenSuccess(true);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const errorRes: CommonHTTPResponse = error?.response?.data;
        if (errorRes?.detail) {
          setErrorMessage(errorRes.detail);
        }
      }
      setOpenError(true);
    },
  });

  const formSchema = z
    .object({
      firstName: z.string().min(1, "Please enter a name"),
      lastName: z.string().min(1, "Please enter a last name"),
      dob: z.string().min(1, "Please enter your date of birth"),
      email: z.email().min(1, "Please enter a valid email"),
      password: z.string().min(8, "Password must be a minimum of 8 characters"),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    disabled: isPending,
  });

  const validateForm = async () => {
    await form.trigger();
  };

  const submitSignup = async (data: z.infer<typeof formSchema>) => {
    const invalidForm = Object.entries(data).some(([_, value]) => !value);

    if (invalidForm) {
      toast.warning("Please fill out entire form");
      return;
    }

    const userInput = {
      ...data,
      dob: new Date(`${data.dob}T00:00:00Z`).toISOString(),
    } satisfies UserInput;
    mutate(userInput);
  };

  return (
    <>
      <Card {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="signup-form" onSubmit={form.handleSubmit(submitSignup)}>
            <FieldGroup>
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="First name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="First name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      name="email"
                      type="email"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="Please enter a valid email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                  </Field>
                )}
              />
              <Controller
                name="dob"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date">Date of birth</FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      name="firstName"
                      type="date"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="First name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>

                    <Input
                      {...field}
                      id="password"
                      name="password"
                      type="password"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirm_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm_password">
                      Confirm Password
                    </FieldLabel>

                    <Input
                      {...field}
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      required
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldGroup>
                <Field>
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-full"
                    disabled={isPending}
                    onClick={validateForm}
                  >
                    {isPending ? <Spinner data-icon="inline-start" /> : null}
                    Create Account
                  </Button>
                  {isPending ? null : (
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <a href="/login">Sign in</a>
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Dialog open={openSuccess}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Account Successfully Created</DialogTitle>
            <DialogDescription>
              Congratulations, your account has been created! Please verify your
              email to login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" onClick={navigateToLogin}>
                Go to login
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openError}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Account Not Created</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" onClick={() => setOpenError(false)}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
