import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SpinnerCustom } from "~/components/ui/spinner";
import { AuthContext } from "~/contexts/AuthContext";
import SidebarLayout from "~/layouts/sidebar-layout";
import api from "~/lib/api";
import { APP_ROUTES } from "~/routes";

export default function AccountPage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data } = await api.user.getCurrentProfileUserMeGet();
      return data;
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }

      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (!isError) {
      return;
    }

    if (axios.isAxiosError(error)) {
      const errorRes = error?.response;
      if (errorRes?.status === 401) {
        logout();
        toast.error(
          errorRes?.data?.details ??
            "Unauthorized access. Please sign in again.",
        );
      }
    }
  }, [isError, error, navigate]);

  return (
    <SidebarLayout
      currentRoute={APP_ROUTES.ACCOUNT}
      header="Account Details"
      children={
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {isLoading || !data ? (
            <SpinnerCustom />
          ) : (
            <div className="flex flex-col gap-4 max-w-xs">
              <Label>Name</Label>
              <Input
                id="name"
                value={`${data.firstName} ${data.lastName}`}
                readOnly
              />
              <Label>Email</Label>
              <Input id="email" value={data.email} readOnly />
              <Label>Date of Birth</Label>
              <Input id="dob" value={data.dob} readOnly />

              <Button className="w-min ml-auto" onClick={logout}>
                Log Out
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
}
