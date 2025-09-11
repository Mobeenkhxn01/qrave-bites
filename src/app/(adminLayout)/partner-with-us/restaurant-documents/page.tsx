"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";


// ✅ Zod Schema for Step 3 - Restaurant Documents
const formSchema = z
  .object({
    ownerName: z
      .string()
      .min(2, "Owner name must be at least 2 characters")
      .max(50, "Owner name must not exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Owner name can only contain letters and spaces"),

    panNumber: z
      .string()
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Enter a valid PAN number (e.g., ABCDE1234F)"
      ),

    restoAddress: z
      .string()
      .min(5, "Street address must be at least 5 characters")
      .max(100, "Street address must not exceed 100 characters"),

    accountNumber: z
      .string()
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must not exceed 18 digits")
      .regex(/^\d+$/, "Account number must contain only digits"),

    confirmAccountNumber: z
      .string()
      .min(9, "Confirm account number is required")
      .max(18, "Confirm account number must not exceed 18 digits"),

    ifscCode: z
      .string()
      .regex(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Enter a valid IFSC code (e.g., SBIN0001234)"
      ),

    panImage: z.instanceof(File).optional(),

    upiId: z
      .string()
      .regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,20}$/, "Enter a valid UPI ID")
      .optional()
      .or(z.literal("")),

    // FIXED: Removed `required_error` and added `.refine()` instead
    accountType: z.enum(["savings", "current"]).refine((val) => !!val, {
      message: "Please select an account type",
    }),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

type FormData = z.infer<typeof formSchema>;

export default function RestaurantDocumentsPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      panNumber: "",
      restoAddress: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      upiId: "",
      accountType: undefined,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      console.log("Form Submitted", values);
      toast.success("Documents submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Restaurant Documents</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Owner Name */}
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PAN Number */}
          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input placeholder="ABCDE1234F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Restaurant Address */}
          <FormField
            control={form.control}
            name="restoAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full restaurant address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Number */}
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Account Number */}
          <FormField
            control={form.control}
            name="confirmAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Re-enter account number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* IFSC Code */}
          <FormField
            control={form.control}
            name="ifscCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="SBIN0001234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UPI ID */}
          <FormField
            control={form.control}
            name="upiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="username@bank" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Type */}
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="current">Current Account</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Documents"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
