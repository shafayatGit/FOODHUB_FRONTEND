import CategoryCreateForm from "@/components/modules/Admin/CategoryCreateForm";
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
import type { Category } from "@/types/category.types";
import { FolderPlus, ListTree } from "lucide-react";

interface CategoryManagementProps {
  categories: Category[];
}

const CategoryManagement = ({ categories }: CategoryManagementProps) => {
  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ListTree className="size-4" />
            Menu categories
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">
            Category Management
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Create and review meal categories used across the FoodHub menu.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm shadow-sm">
          <FolderPlus className="size-4 text-muted-foreground" />
          <span className="font-medium">{categories.length}</span>
          <span className="text-muted-foreground">categories</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Create Category</CardTitle>
            <CardDescription>
              Add a new category name and description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryCreateForm />
          </CardContent>
        </Card>

        <Card className="hidden border-0 shadow-sm md:flex">
          <CardHeader className="pb-3">
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              Categories currently available for menu organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="min-w-[220px]">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {category.id}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-28 text-center text-muted-foreground"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:hidden">
          {categories.length > 0 ? (
            categories.map((category) => (
              <article
                key={category.id}
                className="rounded-2xl bg-card p-4 text-sm shadow-sm ring-1 ring-foreground/5"
              >
                <p className="font-medium">{category.name}</p>
                <p className="mt-2 text-muted-foreground">
                  {category.description}
                </p>
                <p className="mt-3 truncate font-mono text-xs text-muted-foreground">
                  {category.id}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl bg-card p-8 text-center text-sm text-muted-foreground shadow-sm ring-1 ring-foreground/5">
              No categories found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryManagement;
