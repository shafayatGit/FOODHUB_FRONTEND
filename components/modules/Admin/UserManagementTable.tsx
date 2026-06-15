"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  
  deleteUser,
  updateAdminUserStatus,
} from "@/services/admin-users.services";
import type { AdminUser, AdminUserStatus } from "@/types/admin-user.types";
import { CheckCircle2, ShieldCheck, UserCog, UserX } from "lucide-react";
import { DeleteUserAction } from "./deleteUser";

interface UserManagementTableProps {
  users: AdminUser[];
}

const roleBadgeClassName: Record<AdminUser["role"], string> = {
  ADMIN: "border-sky-200 bg-sky-50 text-sky-700",
  PROVIDER: "border-amber-200 bg-amber-50 text-amber-700",
  CUSTOMER: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusBadgeClassName: Record<AdminUserStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  SUSPENDED: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatDate(date?: string) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = String(parsedDate.getUTCDate()).padStart(2, "0");
  const month = monthNames[parsedDate.getUTCMonth()];
  const year = parsedDate.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

function StatusAction({
  status,
  user,
}: {
  status: AdminUserStatus;
  user: AdminUser;
}) {
  const isActiveAction = status === "ACTIVE";
  const isCurrentStatus = user.status === status;

  if (!isActiveAction) {
    return null;
  }

  return (
    <form action={updateAdminUserStatus}>
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="status" value={status} />
      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={isCurrentStatus}
        className="w-full justify-start sm:w-auto"
      >
        <CheckCircle2 className="size-4" />
        Activate
      </Button>
    </form>
  );
}

function SuspendUserAction({
  user,
  onConfirm,
}: {
  user: AdminUser;
  onConfirm: (user: AdminUser) => void;
}) {
  const isDisabled = user.status === "SUSPENDED";

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      disabled={isDisabled}
      onClick={() => onConfirm(user)}
      className="w-full justify-start sm:w-auto"
    >
      <UserX className="size-4" />
      Suspend
    </Button>
  );
}

function UserIdentity({ user }: { user: AdminUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}

function UserBadges({ user }: { user: AdminUser }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className={roleBadgeClassName[user.role]}>
        {user.role.toLowerCase()}
      </Badge>
      <Badge variant="outline" className={statusBadgeClassName[user.status]}>
        {user.status.toLowerCase()}
      </Badge>
    </div>
  );
}

const UserManagementTable = ({ users }: UserManagementTableProps) => {


  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" />
            Admin controls
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">
            User Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Review customers, providers, and admins, then activate or suspend
            accounts from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm shadow-sm">
          <UserCog className="size-4 text-muted-foreground" />
          <span className="font-medium">{users.length}</span>
          <span className="text-muted-foreground">users</span>
        </div>
      </div>

      <Card className="hidden border-0 shadow-sm md:flex">
        <CardHeader className="pb-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Role and account status controls for every FoodHub user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-65">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <UserIdentity user={user} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={roleBadgeClassName[user.role]}
                      >
                        {user.role.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadgeClassName[user.status]}
                      >
                        {user.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                     <div className="flex justify-end gap-2">
  <StatusAction status="ACTIVE" user={user} />

  {
    user.role !== "ADMIN" && (
      <DeleteUserAction
    user={user}
    onDeleted={() => {
      window.location.reload();
    }}
  />
    )
  }
</div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:hidden">
        {users.length > 0 ? (
          users.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl bg-card p-4 text-sm shadow-sm ring-1 ring-foreground/5"
            >
              <div className="flex items-start justify-between gap-3">
                <UserIdentity user={user} />
                <UserBadges user={user} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="mt-1 font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="mt-1 truncate font-medium">
                    {user.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
  <StatusAction status="ACTIVE" user={user} />

  {
    user.role !== "ADMIN" && (
      <DeleteUserAction
    user={user}
    onDeleted={() => {
      window.location.reload();
    }}
  />
    )
  }
</div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-foreground/5">
            No users found.
          </div>
        )}
      </div>
 
    </section>
  );
};

export default UserManagementTable;
