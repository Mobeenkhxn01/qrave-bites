"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import {
  useRestaurantStep2,
  useSaveRestaurantStep2,
  uploadImage,
} from "@/hooks/useRestaurant";

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const userEmail = session?.user?.email ?? "";

  // ✅ TanStack hooks
  const { data: existingData } = useRestaurantStep2(userEmail);
  const saveMutation = useSaveRestaurantStep2();

  // ✅ form
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

  // ✅ populate existing data safely
  useEffect(() => {
    if (!existingData) return;

    form.reset({
      cuisine: existingData.cuisine || [],
      days: existingData.days || [],
      openingTime: existingData.openingTime || "09:00",
      closingTime: existingData.closingTime || "22:00",
    });
  }, [existingData, form]);

  // ✅ handle unauthenticated redirect (SAFE pattern)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ✅ submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userEmail) {
      toast.error("Please login first");
      return;
    }

    toast.loading("Saving restaurant details...", { id: "save" });

    try {
      // 🔥 parallel uploads
      const [
        restaurantImageUrl,
        foodImageUrl,
        deliveryImageUrl,
        restaurantProfileUrl,
      ] = await Promise.all([
        values.restaurantImage ? uploadImage(values.restaurantImage) : null,
        values.foodImage ? uploadImage(values.foodImage) : null,
        values.deliveryImage ? uploadImage(values.deliveryImage) : null,
        values.restaurantProfileImage
          ? uploadImage(values.restaurantProfileImage)
          : null,
      ]);

      const payload = {
        ...values,
        email: userEmail,
        ...(restaurantImageUrl && { restaurantImageUrl }),
        ...(foodImageUrl && { foodImageUrl }),
        ...(deliveryImageUrl && { deliveryImageUrl }),
        ...(restaurantProfileUrl && { restaurantProfileUrl }),
      };

      const res = await saveMutation.mutateAsync(payload);

      toast.dismiss("save");

      if (res?.success) {
        toast.success("Details saved");
        router.push("/partner-with-us/restaurant-documents");
      } else {
        toast.error(res?.message || "Failed to save details");
      }
    } catch (error) {
      toast.dismiss("save");
      toast.error(
        error instanceof Error ? error.message
          : "An unexpected error occurred. Please try again."
      
      );
    }
  }

  // ✅ loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  // ✅ guard render until authenticated
  if (status === "unauthenticated") return null;

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Mobile Stepper */}
          <div className="block lg:hidden mb-6">
            <TitleHeaderPartner activeStep={2} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop left panel */}
            <aside className="hidden lg:block w-1/3 p-6">
              <TitleHeaderPartner activeStep={2} />
            </aside>

            <section className="w-full lg:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                Menu & Details
              </h1>

              {/* Images */}
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Restaurant Images
                  </h2>
                  <p className="text-sm text-gray-500">
                    Upload 4 images
                  </p>
                </CardHeader>

                <CardContent className="grid gap-5">
                  {(
                    [
                      "restaurantImage",
                      "foodImage",
                      "deliveryImage",
                      "restaurantProfileImage",
                    ] as const
                  ).map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>
                            {field
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (s) => s.toUpperCase())}
                          </FormLabel>
                          <FormControl>
                            <ImageInput
                              id={field}
                              name={field}
                              onChange={(file) => f.onChange(file)}
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
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Select Cuisines
                  </h2>
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Working Hours
                  </h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="openingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="closingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
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
                            <div
                              key={day.id}
                              className={`flex items-center gap-2 border px-3 py-2 rounded-xl cursor-pointer ${
                                field.value.includes(day.id)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <Checkbox
                                checked={field.value.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  const list = checked
                                    ? [...field.value, day.id]
                                    : field.value.filter(
                                        (d) => d !== day.id
                                      );
                                  field.onChange(list);
                                }}
                              />
                              <span>{day.label}</span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-xl bg-[#4947e0] text-white px-6 py-3 hover:bg-[#3a38c7]"
                >
                  {saveMutation.isPending ? "Saving..." : "Next"}
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