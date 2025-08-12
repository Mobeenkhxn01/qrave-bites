"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce.number().positive({ message: "Price must be positive." }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.instanceof(File).optional(),
});

export default function EditMenuForm({ item, onClose }: { item: any; onClose: () => void }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      price: item.price,
      category: item.categoryId,
      description: item.description,
      image: undefined,
    },
  });

  const [preview, setPreview] = useState<string | null>(item.image);

  /** Fetch categories */
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories", session?.user?.id],
    queryFn: async () => {
      const { data } = await axios.get("/api/categories", {
        params: { userId: session?.user?.id },
      });
      return data;
    },
    enabled: !!session?.user?.id,
  });

  /** Update mutation */
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let imageUrl = preview;

      if (values.image) {
        const formData = new FormData();
        formData.append("file", values.image);
        const { data: uploaded } = await axios.post("/api/upload", formData);
        imageUrl = uploaded?.url;
      }

      await axios.put(`/api/menu-items/${item.id}`, {
        name: values.name,
        description: values.description,
        price: values.price,
        categoryId: values.category,
        image: imageUrl,
        userId: session?.user?.id,
      });
    },
    onSuccess: () => {
      toast.success("Menu item updated!");
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              {preview && (
                <Image
                  src={preview}
                  alt="preview"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                      form.setValue("image", file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No categories found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
