import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
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

  const { isLoading, data } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data } = await api.user.getCurrentProfileUserMeGet();
      return data;
    },
  });

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
