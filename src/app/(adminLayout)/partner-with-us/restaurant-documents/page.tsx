"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import TitleHeaderPartner from "../titleheader";

// Step 3 Zod schema - matches API expectations
const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters")
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
    panNumber: z
      .string()
      .length(10, "PAN number must be exactly 10 characters")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
    restaurantAddress: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be less than 500 characters"),
    accountNumber: z
      .string()
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must be less than 18 digits")
      .regex(/^\d+$/, "Account number must contain only digits"),
    confirmAccountNumber: z
      .string()
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must be less than 18 digits"),
    ifscCode: z
      .string()
      .length(11, "IFSC code must be exactly 11 characters")
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (e.g., SBIN0001234)"),
    panImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
    upiId: z
      .string()
      .regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,20}$/, "Invalid UPI ID format")
      .optional()
      .or(z.literal("")),
    accountType: z.enum(["SAVINGS", "CURRENT"]),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

type FormData = z.infer<typeof formSchema>;

export default function Step3Documents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const userEmail = session?.user?.email || "";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      panNumber: "",
      restaurantAddress: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      panImage: "",
      upiId: "",
      accountType: undefined,
    },
  });

  // Load existing Step 3 data if any
  useEffect(() => {
    const loadData = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get(`/api/restaurant/step3?email=${userEmail}`);
        if (res.data.success) {
          const data = res.data.data;
          form.setValue("fullName", data.fullName);
          form.setValue("panNumber", data.panNumber);
          form.setValue("restaurantAddress", data.restaurantAddress);
          form.setValue("accountNumber", data.accountNumber);
          form.setValue("confirmAccountNumber", data.accountNumber);
          form.setValue("ifscCode", data.ifscCode);
          form.setValue("panImage", data.panImage || "");
          form.setValue("upiId", data.upiId || "");
          form.setValue("accountType", data.accountType);
          toast.success("Existing Step 3 data loaded");
        }
      } catch (err) {
        console.log("No existing Step 3 data found");
      }
    };

    if (status === "authenticated") loadData();
  }, [userEmail, status]); // Removed form from dependencies

  const onSubmit = async (values: FormData) => {
    if (!userEmail) {
      toast.error("User email not found. Please login.");
      return;
    }

    const payload = {
      ...values,
      email: userEmail,
      // Convert empty strings to null for optional fields
      panImage: values.panImage || null,
      upiId: values.upiId || null,
    };

    startTransition(() => {
      setLoading(true);
      axios
        .post("/api/restaurant/step3", payload)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message || "Step 3 saved successfully!");
            router.push("/partner-with-us/partner-contract");
          } else {
            toast.error(res.data.message || "Failed to save Step 3");
          }
        })
        .catch((err) => {
          console.error("Error saving Step 3:", err);
          
          if (err.response?.data?.errors) {
            err.response.data.errors.forEach(
              (error: { field: string; message: string }) =>
                toast.error(`${error.field}: ${error.message}`)
            );
          } else if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        })
        .finally(() => setLoading(false));
    });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="block lg:hidden">
            <div className="w-full p-6 flex justify-center items-center mb-8">
              <TitleHeaderPartner activeStep={3} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block w-1/3 p-12">
              <TitleHeaderPartner activeStep={3} />
            </aside>

            <section className="w-full lg:w-2/3 lg:pr-20 space-y-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
                Restaurant Documents
              </h1>

              {/* Owner Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Owner Details</h2>
                  <p className="text-sm text-gray-600">
                    Full name as per official documents
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main St, City, State, Pincode"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* PAN Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">PAN Card Details</h2>
                  <p className="text-sm text-gray-600">
                    Required for business verification
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            className="h-10 md:h-12 uppercase"
                            maxLength={10}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="panImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Card Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://example.com/pan-image.jpg"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Upload your PAN image to a service and paste the URL here
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Bank Details */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Bank Account Details</h2>
                  <p className="text-sm text-gray-600">
                    For receiving payments from customers
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10 md:h-12">
                              <SelectValue placeholder="Select Account Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CURRENT">Current</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="123456789012"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Account Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Re-enter account number"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SBIN0001234"
                            className="h-10 md:h-12 uppercase"
                            maxLength={11}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="username@bank"
                            className="h-10 md:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center md:justify-end">
                <Button
                  type="submit"
                  disabled={loading || isPending}
                  className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38c7] w-full md:w-auto flex items-center justify-center"
                  size="lg"
                >
                  {loading || isPending ? "Processing..." : "Next"}
                  <Right className="ml-2" />
                </Button>
              </div>
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
}