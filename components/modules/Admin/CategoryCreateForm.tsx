"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategory,
  type CategoryActionState,
} from "@/services/categories.services";
import { Plus } from "lucide-react";

const initialState: CategoryActionState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full justify-center"
    >
      <Plus className="size-4" />
      {pending ? "Creating..." : "Create Category"}
    </Button>
  );
}

const CategoryCreateForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createCategory, initialState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input id="category-name" name="name" placeholder="Pizza" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          name="description"
          placeholder="All pizza categories for the menu."
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
};

export default CategoryCreateForm;
