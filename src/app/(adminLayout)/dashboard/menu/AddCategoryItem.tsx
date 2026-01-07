"use client";

import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
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

function capitalizeWords(str: string) {
  return str
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
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

  const { data: categories = [] } = useQuery({
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

  const createOrUpdateCategory = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user.id) throw new Error("Unauthorized");

      const formattedCategory = capitalizeWords(values.category);

      const exists = categories.some(
        (c: any) =>
          c.name.toLowerCase() === formattedCategory.toLowerCase() &&
          c.userId === session.user.id &&
          (!editedCategory || c.id !== editedCategory.id)
      );
      if (exists) throw new Error("Category already exists");

      const payload = editedCategory
        ? { id: editedCategory.id, name: formattedCategory }
        : { name: formattedCategory, userId: session.user.id };

      if (editedCategory) await axios.put("/api/categories", payload);
      else await axios.post("/api/categories", payload);
    },
    onSuccess: () => {
      toast.success(editedCategory ? "Category updated" : "Category created");
      form.reset();
      setEditedCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories", session?.user.id] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || err.message),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrUpdateCategory.mutate(values);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-2 md:p-4"
        >
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a category"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createOrUpdateCategory.isPending}
              className="bg-[#eb0029] w-full sm:w-auto"
            >
              {editedCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>

    </div>
  );
}
