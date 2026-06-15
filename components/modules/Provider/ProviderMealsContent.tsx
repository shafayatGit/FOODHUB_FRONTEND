"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  PlusCircle,
  HelpCircle,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProviderMeal,
  updateProviderMeal,
  deleteProviderMeal,
} from "@/services/provider-dashboard.services";
import { formatCurrency } from "@/components/modules/Meals/meal-helpers";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types/provider.types";
import type { Category } from "@/types/category.types";
import type { Meal } from "@/types/meal.types";

interface ProviderMealsContentProps {
  providerProfile: Provider;
  categories: Category[];
}

export default function ProviderMealsContent({
  providerProfile,
  categories,
}: ProviderMealsContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingMeal, startTransitionAdd] = useTransition();
  const [isUpdatingMeal, startTransitionUpdate] = useTransition();
  const [isDeletingMeal, startTransitionDelete] = useTransition();

  // Add Meal Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("Non-Veg");
  const [isAvailable, setIsAvailable] = useState(true);
  const [mealImage, setMealImage] = useState<File | null>(null);
  const [mealImagePreview, setMealImagePreview] = useState<string | null>(null);

  // Edit Meal Dialog States
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDietaryPreference, setEditDietaryPreference] = useState("");
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete Confirmation Alert States
  const [deletingMealId, setDeletingMealId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const meals = providerProfile.meals ?? [];

  // Filter meals by title
  const filteredMeals = meals.filter((meal) =>
    meal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Edit Dialog
  const handleOpenEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setEditTitle(meal.title);
    setEditDescription(meal.description);
    setEditPrice(String(meal.price));
    setEditCategoryId(meal.categoryId);
    setEditDietaryPreference(meal.dietaryPreference);
    setEditIsAvailable(meal.isAvailable);
    setIsEditDialogOpen(true);
  };

  // Handle image upload
  const handleMealImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setMealImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMealImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear meal image
  const clearMealImage = () => {
    setMealImage(null);
    setMealImagePreview(null);
  };

  // Submit Add Meal
  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !categoryId || !dietaryPreference) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransitionAdd(async () => {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        dietaryPreference,
        isAvailable,
        image: mealImage || undefined,
      };

      const res = await createProviderMeal(payload);
      if (res.success) {
        toast.success("Meal added to menu successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setDietaryPreference("Non-Veg");
        setIsAvailable(true);
        clearMealImage();
      } else {
        toast.error(res.message);
      }
    });
  };

  // Submit Edit Meal
  const handleEditMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeal) return;

    startTransitionUpdate(async () => {
      const payload = {
        title: editTitle,
        description: editDescription,
        price: parseFloat(editPrice),
        categoryId: editCategoryId,
        dietaryPreference: editDietaryPreference,
        isAvailable: editIsAvailable,
      };

      const res = await updateProviderMeal(editingMeal.id, payload);
      if (res.success) {
        toast.success("Meal updated successfully!");
        setIsEditDialogOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (!deletingMealId) return;

    startTransitionDelete(async () => {
      const res = await deleteProviderMeal(deletingMealId);
      if (res.success) {
        toast.success("Meal removed from menu successfully.");
        setIsDeleteDialogOpen(false);
        setDeletingMealId(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <UtensilsCrossed className="size-4" />
            Menu management
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">Manage Menu Items</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Add new food items, toggle availability, edit price, or remove items from your public menu.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm shadow-sm shrink-0 self-start sm:self-auto">
          <PlusCircle className="size-4 text-muted-foreground" />
          <span className="font-medium">{meals.length}</span>
          <span className="text-muted-foreground"> dishes</span>
        </div>
      </section>

      {/* Main Grid: Form Left, Table Right */}
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Form panel */}
        <Card className="border-0 shadow-sm self-start">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Dish</CardTitle>
            <CardDescription>Fill in the specifics for the new menu entry.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMealSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="meal-title">Title *</Label>
                <Input
                  id="meal-title"
                  placeholder="Classic Cheese Pizza"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meal-desc">Description *</Label>
                <Textarea
                  id="meal-desc"
                  placeholder="Rich marinara sauce, loaded with fresh mozzarella cheese and basil..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="meal-price">Price ($) *</Label>
                  <Input
                    id="meal-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="12.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="meal-dietary">Dietary *</Label>
                  <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                    <SelectTrigger id="meal-dietary" className="h-9 w-full">
                      <SelectValue placeholder="Select dietary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Veg">Veg</SelectItem>
                      <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meal-cat">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="meal-cat" className="h-9 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="meal-image">Meal Image <span className="text-muted-foreground">(Optional)</span></Label>
                
                {mealImagePreview && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-muted-foreground/20">
                    <img
                      src={mealImagePreview}
                      alt="Meal preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearMealImage}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                )}

                <label htmlFor="meal-image" className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="flex flex-col items-center justify-center py-3">
                    <Upload className="size-4 text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground text-center px-2">
                      {mealImage ? mealImage.name : "Click or drag image"}
                    </p>
                  </div>
                  <input
                    id="meal-image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMealImageChange}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-foreground/5">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="meal-avail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Available For Order
                  </Label>
                  <p className="text-xs text-muted-foreground">Allow customers to buy this item right away.</p>
                </div>
                <button
                  type="button"
                  id="meal-avail"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isAvailable ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                      isAvailable ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <Button type="submit" disabled={isAddingMeal} className="w-full">
                {isAddingMeal ? "Adding..." : "Add to Menu"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>My Menu Items</CardTitle>
                <CardDescription>Review and manage meals offered in your diner.</CardDescription>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dish</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dietary</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map((meal) => (
                      <TableRow key={meal.id} className="group">
                        <TableCell>
                          <p className="font-semibold text-foreground">{meal.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">{meal.description}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {meal.category?.name ?? "Other"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs uppercase">
                            {meal.dietaryPreference}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(meal.price)}
                        </TableCell>
                        <TableCell>
                          {meal.isAvailable ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              <Check className="size-3 mr-1" /> Yes
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-300">
                              <X className="size-3 mr-1" /> No
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon-sm"
                              variant="outline"
                              onClick={() => handleOpenEdit(meal)}
                              className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit className="size-3.5" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="outline"
                              className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setDeletingMealId(meal.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        No dishes found matching search term.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View Card List */}
            <div className="grid gap-3 p-4 md:hidden">
              {filteredMeals.length > 0 ? (
                filteredMeals.map((meal) => (
                  <article
                    key={meal.id}
                    className="rounded-2xl border bg-card p-4 text-sm space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{meal.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {meal.description}
                        </p>
                      </div>
                      <span className="font-bold text-foreground shrink-0 text-right">
                        {formatCurrency(meal.price)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="secondary">{meal.category?.name ?? "Other"}</Badge>
                      <Badge variant="outline">{meal.dietaryPreference}</Badge>
                      {meal.isAvailable ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-rose-500/10 text-rose-700 dark:text-rose-300">
                          Hidden
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleOpenEdit(meal)}
                      >
                        <Edit className="size-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeletingMealId(meal.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="size-3.5 mr-1.5" /> Delete
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl bg-card border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No dishes found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Meal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleEditMealSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Modify price, details or toggle active status for this dish.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-desc">Description *</Label>
                <Textarea
                  id="edit-desc"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Price ($) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-dietary">Dietary *</Label>
                  <Select value={editDietaryPreference} onValueChange={setEditDietaryPreference}>
                    <SelectTrigger id="edit-dietary" className="h-9 w-full">
                      <SelectValue placeholder="Select dietary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Veg">Veg</SelectItem>
                      <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      <SelectItem value="Vegan">Vegan</SelectItem>
                      <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-cat">Category *</Label>
                <Select value={editCategoryId} onValueChange={setEditCategoryId}>
                  <SelectTrigger id="edit-cat" className="h-9 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3 ring-1 ring-foreground/5">
                <div className="flex-1 space-y-0.5">
                  <Label htmlFor="edit-avail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Available For Order
                  </Label>
                  <p className="text-xs text-muted-foreground">Show or hide this dish from customers.</p>
                </div>
                <button
                  type="button"
                  id="edit-avail"
                  onClick={() => setEditIsAvailable(!editIsAvailable)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    editIsAvailable ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
                      editIsAvailable ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdatingMeal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingMeal}>
                {isUpdatingMeal ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this meal menu item. Customers will no longer be able to browse or order it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingMeal}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeletingMeal}
              variant="destructive"
            >
              {isDeletingMeal ? "Deleting..." : "Delete Dish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
