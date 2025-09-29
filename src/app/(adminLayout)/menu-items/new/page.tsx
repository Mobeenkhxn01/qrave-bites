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
});

export default function NewMenuPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      description: "",
      image: undefined,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  /** 🔹 Fetch categories */
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

  /** 🔹 Mutation to create menu item */
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
      };

      const res = await axios.post("/api/menu-items", dataToSend);
      if (res.status !== 201) throw new Error("Failed to create menu item");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Menu item created successfully!");
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      router.push("/menu-items");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to create menu item"
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMenuItem.mutate(values);
  }

  return (
    <section className="py-8 bg-white">
      <UserTabs />
      <div className="w-1/2 mx-auto p-4">
        <div className="flex items-center justify-center border border-gray-300 p-2 rounded-lg">
          <Link href="/menu-items" className="flex flex-row gap-2 items-center">
            <Left />
            <span>Show all menu items</span>
          </Link>
        </div>
      </div>
      <div className="w-1/2 mx-auto p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-row justify-between"
          >
            {/* Image Upload */}
            <div className="w-1/4 flex justify-center items-start">
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

            {/* Form Fields */}
            <div className="w-2/3">
              <h1 className="text-2xl font-semibold font-serif text-[#eb0029]">
                Add Item to Menu
              </h1>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
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
                      <Textarea placeholder="Enter item description" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-[#eb0029] w-full mt-2"
                disabled={createMenuItem.status === "pending"}
              >
                {createMenuItem.status === "pending" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
