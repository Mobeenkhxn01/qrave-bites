"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TitleHeaderPartner from "../titleheader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageInput } from "@/components/ui/image-input";

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

    panImage: z
      .any()
      .refine((file) => file instanceof File, {
        message: "PAN image is required",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Max file size is 5MB",
      })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        {
          message: "Only .jpg, .png, or .webp formats are supported",
        }
      ),

    accountType: z.enum(["savings", "current"], {
      required_error: "Please select an account type",
    }),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

export default function RestaurantDocument() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      panNumber: "",
      restoAddress: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountType: "savings",
      panImage: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Your layout and aside menu remain unchanged */}
          <div className="flex justify-between items-start gap-6">
            <aside className="w-1/3 p-12 flex justify-center items-end">
              <TitleHeaderPartner activeStep={3} />
            </aside>
            {/* PAN Details Section */}
            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Menu and other operational details
              </h1>

              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">PAN details</h2>
                  <p className="font-extralight text-muted-foreground">
                    Enter the PAN details of the person or company who legally
                    owns the restaurant
                  </p>
                </CardHeader>
                <div className="border-t border-gray-300 w-full p-0"></div>
                <CardContent className="flex gap-4">
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pan Number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="PAN number*"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name as per PAN</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="Full name *"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="restoAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Address</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12"
                            placeholder="Full address *"
                            required
                            {...field}
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
                        <FormLabel>PAN Image</FormLabel>
                        <FormControl>
                          <ImageInput
                            id="pan-image"
                            name="panImage"
                            required
                            maxSizeMB={5}
                            onChange={(file) => field.onChange(file)}
                            // value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardFooter>
              </Card>

              {/* Bank Details Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Bank account details
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    This is where Qravebites will send your earnings
                  </p>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="Account number *"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="confirmAccountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Account Number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="Confirm account number *"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="ifscCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="IFSC code *"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2 grid items-center gap-1.5">
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
                              <SelectItem value="current">
                                Current Account
                              </SelectItem>
                              <SelectItem value="savings">
                                Savings Account
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardFooter>
              </Card>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl bg-[#4947e0] text-white"
                >
                  Next
                  <Right />
                </Button>
              </div>
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
}
