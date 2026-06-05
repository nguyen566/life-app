import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FieldDescription } from "~/components/ui/field";
import api from "~/lib/api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  let token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async (token_input: string) => {
      try {
        await api.user.verifyUserEmailUserVerifyGet({
          token: token_input,
        });
      } catch {
        token = null;
      }
    };

    if (token) {
      verifyEmail(token);
    }
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>
              {token ? "Email Successfully Verified" : "Unable to Verify Email"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {token ? (
              <FieldDescription>
                Your email has been verified! Please{" "}
                <a href="/login">login here</a>
              </FieldDescription>
            ) : (
              "The token you are using is invalid"
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
