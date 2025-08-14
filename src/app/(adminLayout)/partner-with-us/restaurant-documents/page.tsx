"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,20}$/;
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
      .regex(upiRegex, "Enter a valid UPI ID")
      .optional()
      .or(z.literal("")),
    accountType: z.enum(["savings", "current"], {
      required_error: "Please select an account type",
    }),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

export default function RestaurantDocument() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "savings",
      panNumber: "",
      ownerName: "",
      restoAddress: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      upiId: "",
      panImage: undefined,
    },
  });

  useEffect(() => {
    const loadExistingData = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get(
          `/api/restaurant/step3?email=${userEmail}`
        );
        if (response.data.success) {
          const restaurant = response.data.data.restaurant;
          if (restaurant.panNumber)
            form.setValue("panNumber", restaurant.panNumber);
          if (restaurant.fullName)
            form.setValue("ownerName", restaurant.fullName);
          if (restaurant.restaurantAddress)
            form.setValue("restoAddress", restaurant.restaurantAddress);
          if (restaurant.accountNumber)
            form.setValue("accountNumber", restaurant.accountNumber);
          if (restaurant.confirmAccountNumber)
            form.setValue("confirmAccountNumber", restaurant.confirmAccountNumber);
          if (restaurant.ifscCode)
            form.setValue("ifscCode", restaurant.ifscCode);
          if (restaurant.accountType)
            form.setValue("accountType", restaurant.accountType);
          if (restaurant.upiId)
            form.setValue("upiId", restaurant.upiId || "");
        }
      } catch (error) {
        console.log("No existing step3 data found");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      loadExistingData();
    }
  }, [userEmail, status, form]);

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const email = session?.user?.email;
    if (!email) return;

    setIsLoading(true);

    try {
      let panImageUrl: string | null = null;
      if (values.panImage instanceof File) {
        panImageUrl = await uploadImage(values.panImage);
        if (!panImageUrl) {
          console.error("PAN image upload failed");
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        email,
        panNumber: values.panNumber.toUpperCase(),
        fullName: values.ownerName,
        restaurantAddress: values.restoAddress,
        panImage: panImageUrl || "",
        accountNumber: values.accountNumber,
        confirmAccountNumber: values.confirmAccountNumber,
        ifscCode: values.ifscCode.toUpperCase(),
        accountType: values.accountType,
        upiId: values.upiId || null,
      };

      const res = await axios.post("/api/restaurant/step3", payload);

      if (res.data.success) {
        router.push("/partner-with-us/partner-contract");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <aside className="w-full lg:w-1/3 p-6 lg:p-12 flex justify-center items-center">
              <TitleHeaderPartner activeStep={3} />
            </aside>

            <section className="w-full lg:w-2/3 lg:pr-20">
              <h1 className="text-3xl lg:text-4xl font-semibold mb-6">
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
                <div className="border-t border-gray-300 w-full" />
                <CardContent className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-1/2 grid gap-1.5">
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="PAN number*"
                              required
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 grid gap-1.5">
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
                              disabled={isLoading}
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
                            disabled={isLoading}
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Bank account details
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    This is where Qravebites will send your earnings
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-1/2 grid gap-1.5">
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
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 grid gap-1.5">
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
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-6">
                  <div className="w-full flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-1/2 grid gap-1.5">
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
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full lg:w-1/2 grid gap-1.5">
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
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12">
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
                  </div>

                  <div className="w-full grid gap-1.5">
                    <FormField
                      control={form.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="e.g. example@upi"
                              {...field}
                              value={field.value || ""}
                              disabled={isLoading}
                            />
                          </FormControl>
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
                  size="lg"
                  className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38b8]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Next
                      <Right className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
}
