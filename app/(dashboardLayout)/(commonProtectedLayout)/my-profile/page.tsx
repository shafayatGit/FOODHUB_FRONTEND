import MyProfileContent from "@/components/modules/Common/MyProfileContent";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function MyProfilePage() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  return <MyProfileContent userInfo={userInfo} />;
}
