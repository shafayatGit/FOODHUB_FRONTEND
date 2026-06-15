import AdminStats from '@/components/modules/Admin/AdminStats';
import { getDashboardData } from '@/services/dashboard.services';
import React from 'react';

const AdminDashboardPage = async () => {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return (
      <div className="p-6 text-center text-destructive">
        Unable to load admin dashboard data.
      </div>
    );
  }

  return (
    <div>
      <AdminStats stats={dashboardData} />
    </div>
  );
};

export default AdminDashboardPage

