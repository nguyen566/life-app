import { cn } from "~/lib/utils";
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
import { useContext } from "react";
import { AuthContext } from "~/contexts/AuthContext";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useContext(AuthContext);

  const formSchema = z.object({
    email: z.email().min(1, "Please enter a valid email"),
    password: z.string().min(1, "Please enter a password"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitLogin = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;

    await form.trigger();

    if (!email || !password) {
      return;
    }

    await login(email, password);
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(submitLogin)}>
            <FieldGroup>
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
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <div className="flex items-center">
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Button type="submit" form="login-form">
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
