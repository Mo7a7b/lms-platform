import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/settings/LogoutButton";
import { updatePassword } from "@/lib/actions/updatePassword";
import { updateUserProfile } from "@/lib/actions/updateUserProfile";

const UpdatePasswordForm = dynamic(
  () => import("@/components/settings/UpdatePasswordForm"),
);
const DeleteAccountButton = dynamic(
  () => import("@/components/settings/DeleteAccountButton"),
);
const UpdateProfileForm = dynamic(
  () => import("@/components/settings/UpdateProfileForm"),
);
const StripeConnectCard = dynamic(
  () => import("@/components/settings/StripeConnectCard"),
);

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6 bg-muted space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <StripeConnectCard />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UpdateProfileForm action={updateUserProfile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UpdatePasswordForm action={updatePassword} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your session and account existence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Log out</h4>
              <p className="text-sm text-muted-foreground">
                End your current session.
              </p>
            </div>
            <LogoutButton />
          </div>
          <div className="border-t my-4" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-destructive">
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
