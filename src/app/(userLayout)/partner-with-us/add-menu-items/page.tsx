"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageInput } from "@/components/ui/image-input";
import { SelectableList } from "@/components/ui/multi-select";
import TitleHeaderPartner from "../titleheader";
import Right from "@/components/icons/Right";
import { days, CUISINE_ITEMS } from "./constant";

const formSchema = z
  .object({
    cuisine: z
      .array(z.string())
      .min(1, "Select at least one cuisine")
      .max(3, "Maximum 3 cuisines allowed"),
    restaurantImage: z.instanceof(File).optional(),
    foodImage: z.instanceof(File).optional(),
    restaurantProfileImage: z.instanceof(File).optional(),
    deliveryImage: z.instanceof(File).optional(),
    days: z.array(z.string()).min(1, "Select at least one working day"),
    openingTime: z.string().min(1, "Opening time is required"),
    closingTime: z.string().min(1, "Closing time is required"),
  })
  .refine(
    (data) =>
      new Date(`1970-01-01T${data.closingTime}:00`) >
      new Date(`1970-01-01T${data.openingTime}:00`),
    {
      message: "Closing time must be after opening time",
      path: ["closingTime"],
    }
  );

export default function NewRestaurantRegister() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisine: [],
      days: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      openingTime: "09:00",
      closingTime: "22:00",
    },
  });

  /** Prefill existing data */
  useEffect(() => {
    if (!userEmail || status !== "authenticated") return;

    const loadExistingData = async () => {
      try {
        const { data } = await axios.get(
          `/api/restaurant/step2?email=${userEmail}`
        );
        if (data.success && data.data.restaurant) {
          const r = data.data.restaurant;
          form.setValue("cuisine", r.cuisine || []);
          form.setValue(
            "days",
            r.days || [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ]
          );
          form.setValue("openingTime", r.openingTime || "09:00");
          form.setValue("closingTime", r.closingTime || "22:00");
          toast.success("Existing restaurant data loaded");
        }
      } catch (err) {
        console.log("No existing step2 data found");
      }
    };

    loadExistingData();
  }, [userEmail, status, form]);

  /** Helper to upload a single image */
  async function uploadImage(file: File, type: string): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post("/api/upload", formData);
      return data.url;
    } catch (err) {
      console.error(`Upload ${type} error:`, err);
      toast.error(`Failed to upload ${type} image`);
      return null;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userEmail) {
      toast.error("User email not found. Please login.");
      return;
    }

    startTransition(() => {
      setIsLoading(true);

      Promise.all([
        values.restaurantImage
          ? uploadImage(values.restaurantImage, "restaurant")
          : Promise.resolve(null),
        values.foodImage
          ? uploadImage(values.foodImage, "food")
          : Promise.resolve(null),
        values.deliveryImage
          ? uploadImage(values.deliveryImage, "delivery")
          : Promise.resolve(null),
        values.restaurantProfileImage
          ? uploadImage(values.restaurantProfileImage, "profile")
          : Promise.resolve(null),
      ])
        .then(
          ([
            restaurantImageUrl,
            foodImageUrl,
            deliveryImageUrl,
            restaurantProfileUrl,
          ]) => {
            const payload = {
              ...values,
              email: userEmail,
              ...(restaurantImageUrl && { restaurantImageUrl }),
              ...(foodImageUrl && { foodImageUrl }),
              ...(deliveryImageUrl && { deliveryImageUrl }),
              ...(restaurantProfileUrl && { restaurantProfileUrl }),
            };
            return axios.post("/api/restaurant/step2", payload);
          }
        )
        .then((res) => {
          if (res.data.success) {
            toast.success(
              res.data.message || "Restaurant details saved successfully"
            );
            router.push("/partner-with-us/restaurant-documents");
          } else {
            toast.error(
              res.data.message || "Failed to save restaurant details"
            );
          }
        })
        .catch((err: any) => {
          console.error(err);
          toast.error(err.response?.data?.message || "Something went wrong");
        })
        .finally(() => setIsLoading(false));
    });
  }

  /** Redirect if unauthenticated */
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Mobile Aside */}
          <div className="block lg:hidden">
            <div className="w-full p-6 flex justify-center items-center mb-8">
              <TitleHeaderPartner activeStep={2} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <aside className="hidden lg:block w-1/3 p-12 justify-center items-center">
              <TitleHeaderPartner activeStep={2} />
            </aside>

            <section className="w-full lg:w-2/3 lg:pr-20">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
                Menu and Details
              </h1>

              {/* Images Card */}
              <Card className="mb-6 lg:mb-10">
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Restaurant Images
                  </h2>
                  <p className="font-extralight text-cyan-900 text-sm md:text-base">
                    Add high-quality images to showcase your restaurant
                  </p>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {(
                    [
                      "restaurantImage",
                      "foodImage",
                      "deliveryImage",
                      "restaurantProfileImage",
                    ] as const
                  ).map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {fieldName
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </FormLabel>
                          <FormControl>
                            <ImageInput
                              name={fieldName}
                              id={fieldName}
                              onChange={(file) => field.onChange(file)}
                              maxSizeMB={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Cuisine */}
              <Card className="mb-6 lg:mb-10">
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Select Cuisines
                  </h2>
                  <p className="font-extralight text-cyan-900 text-sm md:text-base">
                    Choose up to 3 cuisines that best represent your restaurant
                  </p>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SelectableList
                            items={CUISINE_ITEMS}
                            selectedIds={field.value}
                            onChange={field.onChange}
                            maxSelections={3}
                            searchPlaceholder="Search cuisine..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Operating Hours
                  </h2>
                  <p className="font-extralight text-cyan-900 text-sm md:text-base">
                    Set your restaurant's opening and closing times
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="openingTime"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Opening Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="h-10 md:h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="closingTime"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Closing Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="h-10 md:h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Days</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {days.map((day) => (
                            <FormItem
                              key={day.id}
                              className={`flex items-center border rounded-2xl p-2 space-x-2 cursor-pointer ${
                                field.value.includes(day.id)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    const updated = checked
                                      ? [...field.value, day.id]
                                      : field.value.filter((d) => d !== day.id);
                                    field.onChange(updated);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-center md:justify-end">
                <Button
                  type="submit"
                  disabled={isPending || isLoading}
                  variant="outline"
                  size="lg"
                  className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38c7] w-full md:w-auto"
                >
                  {isPending || isLoading ? "Processing..." : "Next"}
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
