"use client";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Category is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.instanceof(File).optional(),
});

export default function NewMenuPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: "" ,
      description: "",
      image: undefined,
    },
  });

  const {data:session}  = useSession();

  const [preview, setPreview] = useState<string | null>(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  // Redirect when the state updates
  useEffect(() => {
    if (redirectToItems) {
      router.push("/menu-items");
    }
  }, [redirectToItems, router]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  async function uploadImage(file: File): Promise<any | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let imageUrl = null;

    if (values.image) {
      imageUrl = await uploadImage(values.image);
    }

    const dataToSend = {
      ...values,
      image: imageUrl.url!,
      userID: session?.user.id,
    };

    try {

      console.log(dataToSend);
      const _ = await fetch("http://localhost:3000/api/menu-items", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setRedirectToItems(true);
    } catch (error) {
      console.error("Failed to create menu item", error);
    }
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-row justify-between">
            {/* Image Upload Section */}
            <div className="w-1/4 flex justify-center items-start">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    {preview ? (
                      <Image src={preview} className="rounded-lg w-full h-full mb-1" width={250} height={250} alt="preview" />
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
              <h1 className="text-2xl font-semibold font-serif text-[#eb0029]">Add Item to Menu</h1>
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl><Input placeholder="Enter item name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Enter item description" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

<FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl><Input type="number" placeholder="Enter price" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="bg-[#eb0029] w-full mt-2">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
