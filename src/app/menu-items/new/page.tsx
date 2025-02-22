"use client";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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

// 🔹 Define Form Schema
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "veg", // ✅ Set default category
      description: "",
      image: undefined,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted:", values);
    // Handle file upload logic if needed
  }

  return (
    <section className="py-8 bg-white">
      <UserTabs />

      {/* 🔹 Back Button */}
      <div className="w-1/2 mx-auto p-4">
        <div className="flex items-center justify-center border border-gray-300 p-2 rounded-lg">
          <Link href="/menu-items" className="flex flex-row gap-2 items-center">
            <Left />
            <span>Show all menu items</span>
          </Link>
        </div>
      </div>

      {/* 🔹 Form Section */}
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
                        width={512}
                        height={512}
                        alt="Preview"
                        className="w-24 h-24 mt-2 rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 mt-2 flex items-center justify-center border border-gray-300 rounded bg-gray-100">
                        <span className="text-gray-500 text-sm">
                          Upload Image
                        </span>
                      </div>
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
            </div>

            <div className="w-2/3">
              <h1 className="text-2xl font-semibold font-serif text-[#eb0029]">Add Item to Menu</h1>

              {/* Name Field */}
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

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter item description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category Field (Dropdown) */}
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
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                        <SelectItem value="drinks">Drinks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🔹 Submit Button */}
              <Button type="submit" className="bg-[#eb0029] w-full mt-2">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
