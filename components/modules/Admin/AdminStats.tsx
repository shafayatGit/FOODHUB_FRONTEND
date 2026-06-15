"use client";
import { IAdminDashboardData } from '@/types/dashboard.types';
import React from 'react';
import { StatCards } from './StatCards';
import { Separator } from '@/components/ui/separator';
import { UserDistributionChart } from './UserDistributionChart';
import { RevenueChart } from './RevenueChart';
import { MealsChart } from './MealsChart';
import { TopMealsTable, TopProvidersTable } from './TopSections';

interface AdminStatsProps {
  stats: IAdminDashboardData;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section>
          <StatCards stats={stats} />
        </section>

        <Separator />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <UserDistributionChart stats={stats} />
          <RevenueChart stats={stats} />
          <MealsChart stats={stats} />
        </section>

        <Separator />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopMealsTable topMeals={stats.topMeals} />
          <TopProvidersTable topProviders={stats.topProviders} />
        </section>
      </main>
    </div>
  );
};

export default AdminStats;
