import UserManagementTable from "@/components/modules/Admin/UserManagementTable";
import AppPagination from "@/components/shared/AppPagination";
import { getAdminUsers } from "@/services/admin-users.services";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const UserManagementPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const { users, meta } = await getAdminUsers({ page });

  return (
    <div className="space-y-4">
      <UserManagementTable users={users} />
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {meta && <AppPagination meta={meta} />}
      </div>
    </div>
  );
};

export default UserManagementPage;
