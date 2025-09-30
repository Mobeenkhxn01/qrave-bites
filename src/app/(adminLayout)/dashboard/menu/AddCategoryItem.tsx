"use client";

import toast, { Toaster } from "react-hot-toast";
import Trash from "@/components/icons/Trash";
import UserTabs from "@/components/layout/UserTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  category: z.string().min(2).max(50).trim(),
});

// Capitalize first letter of each word but keep spaces
function capitalizeWords(str: string) {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function AddCategoryItem({ onClose }: { onClose: () => void }) {
  const [editedCategory, setEditedCategory] = useState<{
    id: string;
    userId: string;
    name: string;
  } | null>(null);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  });


  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return [];
      const { data } = await axios.get(`/api/categories`, {
        params: { userId: session.user.id },
      });
      return data;
    },
    enabled: !!session?.user.id,
  });

  /** --------------------
   *  Mutations
   ---------------------*/
  const createOrUpdateCategory = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user.id) throw new Error("User not authenticated");

      // Capitalize words before saving
      const formattedCategory = capitalizeWords(values.category);

      // Check if category already exists (case-insensitive)
      const categoryExists = categories.some(
        (category: any) =>
          category.name.toLowerCase() === formattedCategory.toLowerCase() &&
          category.userId === session.user.id &&
          (!editedCategory || category.id !== editedCategory.id)
      );
      if (categoryExists) {
        throw new Error("Category already exists!");
      }

      const payload = editedCategory
        ? { id: editedCategory.id, name: formattedCategory }
        : { name: formattedCategory, userId: session.user.id };

      if (editedCategory) {
        await axios.put("/api/categories", payload);
      } else {
        await axios.post("/api/categories", payload);
      }
    },
    onSuccess: () => {
      toast.success(editedCategory ? "Category updated!" : "Category created!");
      setEditedCategory(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["categories", session?.user.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || err.message || "Error processing request");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories`, { params: { id } });
    },
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories", session?.user.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Error deleting category");
    },
  });

  /** --------------------
   *  Submit Handler
   ---------------------*/
  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrUpdateCategory.mutate(values);
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            <div className="flex flex-col flex-1 gap-4">
              <div className="grid items-center gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Create a new category"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                 <Button
                type="submit"
                onClick={onClose}
                className="bg-[#eb0029]"
                disabled={createOrUpdateCategory.isPending}
              >
                {editedCategory ? "Update" : "Create"}
              </Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
      <Toaster/>
    </div>
  );
}
