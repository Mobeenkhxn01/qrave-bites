"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  streetaddress: z.string().min(2, { message: "Street address is required." }),
  postalCode: z.string().min(2, { message: "Invalid postal code." }),
  city: z.string().min(2, { message: "City name must be valid." }),
  country: z.string().min(2, { message: "Country is required." }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: "Phone number must contain only digits." })
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number cannot exceed 15 digits." }),
  userID: z.string(),
  image: z.any().optional(),
});

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      streetaddress: "",
      postalCode: "",
      city: "",
      country: "",
      phone: "",
      userID: "",
      image: undefined,
    },
  });

  // ✅ Set form values when session loads
  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        email: session.user.email || "",
        userID: session.user.id || "",
      });
    }
  }, [session, form]);

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data.map((country: any) => country.name.common).sort());
      } catch {
        setError("Failed to load countries. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // ✅ Upload image function
  async function uploadImage(file: File): Promise<any | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");

      return await response.json();
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  }

  // ✅ Form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    let imageUrl = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const dataToSend = {
      ...values,
      userID: session?.user.id,
      image: imageUrl ? imageUrl.url : undefined,
    };

    try {
      console.log("Sending data:", dataToSend);
      await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  }

  return (
    <section className="py-8 bg-white">
      <UserTabs />

      <div className="w-1/2 mx-auto p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-row justify-center gap-3"
          >
            {/* Image Upload */}
            <div className="flex justify-center w-1/4 mt-8">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <Image
                      src={preview || session?.user.image || ""}
                      className="rounded-lg w-32 mb-1"
                      width={512}
                      height={512}
                      alt="preview"
                    />
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
                              setImageFile(file);
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" disabled />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streetaddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex flex-wrap justify-between">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="w-5/12">
                      <FormLabel>Postal Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-3/6">
                      <FormLabel>City</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex flex-wrap justify-between ">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-5/12">
                      <FormLabel>Phone</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country Select */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-3/6">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            form.setValue("country", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {loading ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : (
                                countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="bg-[#eb0029] w-full mt-2">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
