import UserManagementTable from "@/components/modules/Admin/UserManagementTable";
import { getAdminUsers } from "@/services/admin-users.services";

const UserManagementPage = async () => {
  const users = await getAdminUsers();

  return <UserManagementTable users={users} />;
};

export default UserManagementPage;
