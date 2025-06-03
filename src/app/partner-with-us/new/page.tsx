"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import axios from "axios";
import { z } from "zod";
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
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import TitleHeaderPartner from "../titleheader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // Add this to your project: npm install sonner

const LocationMapWithSearch = dynamic(
  () => import("@/components/layout/LocationMapWithSearch"),
  { ssr: false }
);

const formSchema = z.object({
  restaurantname: z.string().min(2, "Restaurant name must be at least 2 characters").max(50, "Restaurant name must be less than 50 characters"),
  ownername: z.string().min(2, "Owner name must be at least 2 characters").max(50, "Owner name must be less than 50 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10,15}$/, "Phone number must be 10-15 digits"),
  mobile: z.boolean().default(false).optional(),
  shop: z.coerce.number().min(1, "Shop number must be at least 1").max(99999, "Shop number too large"),
  floor: z.string().optional(),
  area: z.string().min(2, "Area must be at least 2 characters").max(50, "Area must be less than 50 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(50, "City must be less than 50 characters"),
  landmark: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewRestaurantRegister() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = session?.user?.email || "";
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantname: "",
      ownername: "",
      email: userEmail,
      phone: "",
      mobile: true,
      shop: 1,
      floor: "",
      area: "",
      city: "",
      landmark: "",
      latitude: null,
      longitude: null,
      address: "",
    },
  });

  // Update form email when session loads
  useEffect(() => {
    if (userEmail) {
      form.setValue("email", userEmail);
    }
  }, [userEmail, form]);

  // Load existing restaurant data if available
  useEffect(() => {
    const loadExistingData = async () => {
      if (!userEmail) return;
      
      try {
        const response = await axios.get(`/api/restaurant/step1?email=${userEmail}`);
        if (response.data.success) {
          const restaurant = response.data.data.restaurant;
          
          // Pre-fill form with existing data
          form.setValue("restaurantname", restaurant.restaurantName);
          form.setValue("ownername", restaurant.ownerName);
          form.setValue("phone", restaurant.phone);
          form.setValue("mobile", restaurant.mobile);
          form.setValue("shop", restaurant.location.shop);
          form.setValue("floor", restaurant.location.floor || "");
          form.setValue("area", restaurant.location.area);
          form.setValue("city", restaurant.location.city);
          form.setValue("landmark", restaurant.location.landmark || "");
          
          if (restaurant.location.coordinates.latitude && restaurant.location.coordinates.longitude) {
            setLat(restaurant.location.coordinates.latitude);
            setLng(restaurant.location.coordinates.longitude);
            form.setValue("latitude", restaurant.location.coordinates.latitude);
            form.setValue("longitude", restaurant.location.coordinates.longitude);
          }
          
          if (restaurant.location.address) {
            setAddress(restaurant.location.address);
            form.setValue("address", restaurant.location.address);
          }
          
          toast.info("Existing restaurant data loaded");
        }
      } catch (error) {
        // Restaurant doesn't exist yet, which is fine
        console.log("No existing restaurant data found");
      }
    };

    if (status === "authenticated") {
      loadExistingData();
    }
  }, [userEmail, status, form]);

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setLat(lat);
    setLng(lng);
    setAddress(address);
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
    form.setValue("address", address);
  };

  async function onSubmit(values: FormData) {
    if (!userEmail) {
      toast.error("User email not found. Please login.");
      return;
    }

    const payload = {
      ...values,
      email: userEmail,
      latitude: lat,
      longitude: lng,
      address,
    };

    startTransition(() => {
      setIsLoading(true);
      
      axios
        .post("/api/restaurant/step1", payload)
        .then((response) => {
          if (response.data.success) {
            const { isNew, message } = response.data.data;
            
            toast.success(message);
            
            // Navigate to next step
            router.push("/partner-with-us/add-menu-items");
          } else {
            toast.error("Failed to save restaurant information");
          }
        })
        .catch((error) => {
          console.error("Error saving restaurant:", error);
          
          if (error.response?.data?.details) {
            // Handle validation errors
            const details = error.response.data.details;
            details.forEach((detail: { field: string; message: string }) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Failed to save restaurant information. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-start gap-6">
            <aside className="w-1/3 p-12 flex justify-center items-end">
              <TitleHeaderPartner activeStep={1} />
            </aside>

            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Restaurant Information
              </h1>

              {/* Restaurant Name Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Restaurant name</h2>
                  <p className="font-extralight text-cyan-900">
                    Customers will see this name on QraveBites
                  </p>
                </CardHeader>
                <CardContent className="grid gap-1.5">
                  <FormField
                    control={form.control}
                    name="restaurantname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12"
                            placeholder="Restaurant Name*"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Owner Details Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Owner details</h2>
                  <p className="font-extralight text-cyan-900">
                    QraveBites will use these details for all business
                    communications
                  </p>
                </CardHeader>

                <CardContent className="flex gap-4">
                  <div className="w-1/2 grid items-center gap-1.5">
                    <FormField
                      control={form.control}
                      name="ownername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="Full Name*"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              className="h-12"
                              placeholder="Email Address *"
                              disabled
                              value={userEmail}
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col ">
                  <div className="w-full flex items-end gap-2">
                    <div className="w-1/12 flex items-center justify-center border rounded-md px-2 py-3">
                      <Image
                        className="w-6 h-auto"
                        src="/india-flag.webp"
                        alt="indian-flag"
                        width={24}
                        height={16}
                        priority={false}
                      />
                      <span className="ml-1">+91</span>
                    </div>

                    <div className="w-11/12 flex flex-col items-start gap-1.5">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                className="h-12 w-full"
                                placeholder="Phone Number *"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full flex item-start flex-col justify-center mt-6">
                    <h1 className="text-2xl font-semibold">
                      Restaurant&apos;s primary contact number
                    </h1>
                    <p className="font-extralight text-cyan-900">
                      Customers may call on this number for order support
                    </p>
                    <div className="flex font-extralight items-center space-x-2 rounded-2xl">
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem className="w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                This is same as owner mobile number
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardFooter>
              </Card>

              {/* Location Card */}
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">
                    Add your restaurant&apos;s location
                  </h2>
                </CardHeader>

                <CardContent className="w-full">
                  <LocationMapWithSearch
                    onLocationChange={handleLocationChange}
                  />
                </CardContent> 

                <CardFooter className="flex flex-col">
                  <div className="w-full flex gap-4 mb-6">
                    <div className="w-1/2 grid items-center gap-1.5">
                      <FormField
                        control={form.control}
                        name="shop"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-12"
                                placeholder="Shop Number/ Building Number *"
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
                        name="floor"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-12"
                                placeholder="Floor / Tower number (Optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-4">
                    <div className="w-1/2 grid items-center gap-1.5">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-12"
                                placeholder="Area/ sector/ Locality *"
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
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="h-12"
                                placeholder="City *"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-4 mt-6">
                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              type="text"
                              className="h-12"
                              placeholder="Add any nearby landmark (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardFooter>
              </Card>
              
              <div className="mt-6 flex justify-end item-center">
                <div className="">
                  <Button
                    type="submit"
                    disabled={isPending || isLoading}
                    variant={"outline"}
                    size={"lg"}
                    className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38c7]"
                  >
                    {isPending || isLoading ? "Processing..." : "Next"}
                    <Right />
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
}