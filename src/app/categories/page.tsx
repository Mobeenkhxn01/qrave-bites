"use client";
import toast, { Toaster } from "react-hot-toast";
import Trash from "@/components/icons/Trash";
import UserTabs from "@/components/layout/UserTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  category: z.string().min(2).max(50).trim(),
});

export default function Categories() {
  const [categories, setCategories] = useState<
    { id: string; userId: string; name: string }[]
  >([]);
  const [editedCategory, setEditedCategory] = useState<{
    id: string;
    userId: string;
    name: string;
  } | null>(null);

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  });

  useEffect(() => {
    if (session?.user.id) {
      fetchCategories();
    }
  }, [session?.user.id]);

  async function fetchCategories() {
    try {
      if (!session?.user.id) return;
      const response = await fetch(`/api/categories?userId=${session.user.id}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories!");
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!session?.user.id) {
        toast.error("User not authenticated");
        return;
      }

      // Check if category already exists (case-insensitive)
      const categoryExists = categories.some(
        (category) =>
          category.name.toLowerCase() === values.category.toLowerCase() &&
          category.userId === session.user.id &&
          (!editedCategory || category.id !== editedCategory.id) // exclude currently edited category
      );

      if (categoryExists) {
        toast.error("Category already exists!");
        return;
      }

      // Prepare payload for POST or PUT
      const data = editedCategory
        ? { id: editedCategory.id, name: values.category }
        : { name: values.category, userId: session.user.id };

      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Request failed");
      }

      toast.success(editedCategory ? "Category updated!" : "Category created!");
      setEditedCategory(null);
      form.reset();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Error processing request");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Error deleting category");
    }
  }

  return (
    <section className="py-8 relative bottom-0 mb-0 bg-white">
      <UserTabs />
      <div className="w-1/2 mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input placeholder="Create New Categories" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-[#eb0029]">
                {editedCategory ? "Update" : "Create"}
              </Button>
              {editedCategory && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedCategory(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
        <Toaster />
      </div>

      <div className="w-1/2 mx-auto p-4">
        <Label>Existing Categories</Label>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#F3F4F6] flex justify-between items-center rounded-md p-2 mt-2"
            >
              <p className="p-4">{category.name}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditedCategory(category);
                    form.setValue("category", category.name);
                  }}
                >
                  Edit
                </Button>
                <Button variant="outline" onClick={() => handleDelete(category.id)}>
                  <Trash />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No categories available</p>
        )}
      </div>
    </section>
  );
}
