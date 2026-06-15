import ProviderDashboardContent from "@/components/modules/Provider/ProviderDashboardContent";
import { getMyProviderProfile } from "@/services/provider-dashboard.services";
import { getUserInfo } from "@/services/auth.services";

export const dynamic = "force-dynamic";

const ProviderDashboardPage = async () => {
  const userInfo = await getUserInfo();
  const providerProfile = await getMyProviderProfile();

  if (!providerProfile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-destructive">Profile Not Found</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Unable to load provider profile. Please make sure you are registered as a provider and logged in.
        </p>
      </div>
    );
  }

  return (
    <ProviderDashboardContent
      userInfo={userInfo}
      providerProfile={providerProfile}
    />
  );
};

export default ProviderDashboardPage;
