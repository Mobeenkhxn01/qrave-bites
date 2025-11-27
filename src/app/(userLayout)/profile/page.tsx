"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

import { useUserProfile } from "@/hooks/useUserProfile";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserTabs from "@/components/layout/UserTabs";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  streetAddress: z.string().min(2, { message: "Street address is required." }),
  postalCode: z.string().min(2, { message: "Invalid postal code." }),
  city: z.string().min(2, { message: "City is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone must contain only digits." })
    .min(10, { message: "Phone must be at least 10 digits." })
    .max(15, { message: "Phone cannot exceed 15 digits." }),
});

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: profile, isLoading } = useUserProfile();
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      streetAddress: "",
      postalCode: "",
      city: "",
      country: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        streetAddress: profile.userAddresses?.[0]?.streetAddress || "",
        postalCode: profile.userAddresses?.[0]?.postalCode || "",
        city: profile.userAddresses?.[0]?.city || "",
        country: profile.userAddresses?.[0]?.country || "",
        phone: profile.userAddresses?.[0]?.phone || "",
      });

      if (profile.image) setPreview(profile.image);
    }
  }, [profile, form]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed");

    return res.json();
  };

  const updateProfileMutation = useMutation({
  mutationFn: async (values: z.infer<typeof formSchema>) => {
    toast.loading("Saving your profile...");

    let imageUrl: string | null = null;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      imageUrl = uploaded.url;
    }

    const body: Record<string, any> = {
      ...values,
      userId: session?.user.id,
      image: imageUrl || profile?.image || null,
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    toast.dismiss();

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update profile");
    }

    return res.json();
  },
  onSuccess: () => {
    toast.success("Profile updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  },
  onError: (err: any) => {
    toast.error(err.message || "Something went wrong!");
  },
});


  const onSubmit = (values: z.infer<typeof formSchema>
) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Toaster />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <Toaster position="top-right" />
      <UserTabs />

      <div className="max-w-4xl mx-auto p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-8"
          >
            <div className="flex flex-col items-center md:w-1/3">
              <Image
                src={preview || session?.user?.image || "/breadcumb.jpg"}
                width={140}
                height={140}
                alt="Profile"
                className="rounded-lg w-36 h-36 object-cover mb-4"
              />

              <label className="cursor-pointer border border-gray-300 px-4 py-2 rounded-lg text-sm">
                Change Image
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setPreview(URL.createObjectURL(file));
                    setImageFile(file);
                    toast.success("Image selected! Click Save.");
                  }}
                />
              </label>
            </div>

            <div className="md:w-2/3 space-y-4">
              <FormField
                name="name"
                control={form.control}
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

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="streetAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="postalCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="bg-[#eb0029] text-white w-full md:w-auto"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
