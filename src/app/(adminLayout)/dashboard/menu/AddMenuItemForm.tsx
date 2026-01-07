"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


const formSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  description: z.string().min(10),
  image: z.instanceof(File).optional(),
  prepTime: z.coerce.number().min(1),
  available: z.boolean().optional(),
});

export default function AddMenuItemForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      image: undefined,
      prepTime: 15,
      available: true,
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await axios.get("/api/categories", {
        params: { userId: session.user.id },
      });
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const createMenuItem = useMutation({
    mutationFn: async (values: any) => {
      let imageUrl = null;

      if (values.image) {
        const fd = new FormData();
        fd.append("file", values.image);
        const { data } = await axios.post("/api/upload", fd);
        imageUrl = data?.url || null;
      }

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        image: imageUrl,
        categoryId: values.category,
        prepTime: values.prepTime,
        available: values.available,
        userId: session?.user?.id,
      };

      await axios.post("/api/menu-items", payload);
    },
    onSuccess: () => {
      toast.success("Menu item created!");
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create item");
    },
  });

  function onSubmit(values: any) {
    createMenuItem.mutate(values);
  }

  return (
    <div className="p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="flex flex-col md:flex-row gap-6">
           
            <div className="flex flex-col items-center md:w-1/3 w-full">
              {preview ? (
                <Image
                  src={preview}
                  width={250}
                  height={250}
                  alt="preview"
                  className="rounded-lg object-cover w-full h-56"
                />
              ) : (
                <div className="rounded-lg bg-gray-200 text-gray-500 p-6 w-full h-56 flex items-center justify-center">
                  Upload Image
                </div>
              )}

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full mt-3">
                    <FormControl>
                      <label className="cursor-pointer border rounded-lg p-2 text-center w-full">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPreview(URL.createObjectURL(file));
                              field.onChange(file);
                            }
                          }}
                        />
                        Change Image
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 space-y-4">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                        {!categories.length && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="₹0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time (mins)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#eb0029] w-full sm:w-auto"
                  disabled={createMenuItem.isPending}
                >
                  {createMenuItem.isPending ? "Adding..." : "Add Item"}
                </Button>
              </DialogFooter>

            </div>
          </div>

        </form>
      </Form>
    </div>
  );
}
