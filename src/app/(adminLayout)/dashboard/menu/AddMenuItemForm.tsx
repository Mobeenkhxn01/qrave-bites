"use client";

import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  image: z.instanceof(File).optional(),
  prepTime: z.coerce
    .number()
    .min(1, { message: "Prep time must be at least 1 minute." }),
  available: z.boolean().optional(),
});

export default function AddMenuItemForm({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: undefined,
      prepTime: 15,
      available: true,
    },
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
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
  mutationFn: async (values: z.infer<typeof formSchema>) => {
    if (!session?.user?.id) throw new Error("Missing user ID");

    let imageUrl = null;
    if (values.image) {
      const formData = new FormData();
      formData.append("file", values.image);
      const { data: uploaded } = await axios.post("/api/upload", formData);
      imageUrl = uploaded?.url || null;
    }

    const dataToSend = {
      name: values.name,
      description: values.description,
      price: values.price,
      image: imageUrl,
      userId: session.user.id,
      categoryId: values.category,
      prepTime: values.prepTime,
      available: values.available ?? true,
    };

    const res = await axios.post("/api/menu-items", dataToSend);
    if (res.status !== 201) throw new Error("Failed to create menu item");
    return res.data;
  },
  onSuccess: () => {
    toast.success("Menu item created successfully!");
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    onClose(); // ✅ Close the dialog only after success
  },
  onError: (error: any) => {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to create menu item"
    );
  },
});


  function onSubmit(values: z.infer<typeof formSchema>) {
    createMenuItem.mutate(values);
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-6">
            <div className=" flex justify-center items-start">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    {preview ? (
                      <Image
                        src={preview}
                        className="rounded-lg w-full h-full mb-1"
                        width={250}
                        height={250}
                        alt="preview"
                      />
                    ) : (
                      <div className="text-center bg-gray-200 p-4 text-gray-500 rounded-lg mb-1">
                        Upload Image
                      </div>
                    )}
                    <FormControl>
                      <label className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPreview(URL.createObjectURL(file));
                              form.setValue("image", file);
                            }
                          }}
                        />
                        Change image
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <div className="grid items-center gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Item Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item name"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid items-center gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter item description"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid  items-center gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCategories ? (
                            <SelectItem value="loading" disabled>
                              Loading...
                            </SelectItem>
                          ) : categories.length > 0 ? (
                            categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
              </div>
              <div className="grid items-center gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid items-center gap-4">
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">
                        Prep Time (mins)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter prep time"
                          {...field}
                          className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Available</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
                  className="bg-[#eb0029] w-full mt-2"
                  disabled={createMenuItem.status === "pending"}
                >
                  {createMenuItem.status === "pending"
                    ? "Adding item..."
                    : "Add Item"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
