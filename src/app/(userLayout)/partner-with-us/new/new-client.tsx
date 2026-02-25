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
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import TitleHeaderPartner from "../titleheader";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const LocationMapWithSearch = dynamic(
  () => import("@/components/layout/LocationMapWithSearch"),
  { ssr: false }
);


const formSchema = z.object({
  restaurantname: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters"),
  ownername: z
    .string()
    .min(2, "Owner name must be at least 2 characters"),
  email: z.email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  mobile: z.boolean().default(true),
  shop: z.coerce.number().min(1, "Shop number required"),
  floor: z.string().optional(),
  area: z.string().min(2, "Area name is required"),
  city: z.string().min(2, "City name is required"),
  landmark: z.string().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
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

  // Keep email synced after login
  useEffect(() => {
    if (userEmail) form.setValue("email", userEmail);
  }, [userEmail]);

  // Load existing restaurant data
  useEffect(() => {
    if (!userEmail || status !== "authenticated") return;

    const loadExisting = async () => {
      try {
        const response = await axios.get(
          `/api/restaurant/step1?email=${userEmail}`
        );

        if (response.data.success) {
          const r = response.data.data.restaurant;

          form.reset({
            restaurantname: r.restaurantName,
            ownername: r.ownerName,
            email: userEmail,
            phone: r.phone,
            mobile: r.mobile ?? true,
            shop: r.shop,
            floor: r.floor || "",
            area: r.area,
            city: r.city,
            landmark: r.landmark || "",
            latitude: r.latitude,
            longitude: r.longitude,
            address: r.address,
          });

          if (r.latitude && r.longitude) {
            setLat(r.latitude);
            setLng(r.longitude);
          }

          if (r.address) setAddress(r.address);

          toast.success("Existing restaurant details loaded");
        }
      } catch {
        console.log("No previous step1 data");
      }
    };

    loadExisting();
  }, [userEmail, status]);

  // Map updates latitude, longitude, address
  const handleLocationChange = (la: number, lo: number, adr: string) => {
    setLat(la);
    setLng(lo);
    setAddress(adr);

    form.setValue("latitude", la);
    form.setValue("longitude", lo);
    form.setValue("address", adr);
  };

  async function onSubmit(values: FormData) {
    if (!lat || !lng) {
      toast.error("Please select your restaurant location on the map");
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
      toast.loading("Saving restaurant details...", { id: "saving" });

      axios
        .post("/api/restaurant/step1", payload)
        .then((res) => {
          toast.dismiss("saving");

          if (res.data.success) {
            toast.success("Restaurant details saved");
            router.push("/partner-with-us/add-menu-items");
          } else {
            toast.error(res.data.message || "Failed to save");
          }
        })
        .catch((err) => {
          toast.dismiss("saving");

          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Error saving restaurant";
          toast.error(msg);
        })
        .finally(() => setIsLoading(false));
    });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 pb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-6xl mx-auto"
        >
          {/* Mobile header */}
          <div className="block lg:hidden">
            <div className="w-full p-6 flex justify-center mb-6">
              <TitleHeaderPartner activeStep={1} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:block w-1/3 p-8">
              <TitleHeaderPartner activeStep={1} />
            </aside>

            {/* Main form */}
            <section className="w-full lg:w-2/3 lg:pr-16">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-semibold mb-4">
                Restaurant Information
              </h1>

              {/* Restaurant Name Card */}
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">Restaurant Name</h2>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="restaurantname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Restaurant name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Owner details */}
              <Card className="mb-6">
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">Owner Details</h2>
                </CardHeader>

                <CardContent className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Owner Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input value={userEmail} disabled readOnly />
                    </FormControl>
                  </FormItem>
                </CardContent>

                <CardContent>
                  <div className="flex gap-2">
                    <div className="border px-3 flex items-center rounded-md">
                      +91
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="10–15 digits" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem className="flex gap-2 items-center border p-3 rounded-xl">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>This is same as owner mobile number</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Restaurant Location
                  </h2>
                </CardHeader>

                <CardContent>
                  <LocationMapWithSearch onLocationChange={handleLocationChange} />
                </CardContent>

                <CardFooter className="grid gap-4">

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shop"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop / Building No.</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor / Tower (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Floor / Tower" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area / Locality</FormLabel>
                          <FormControl>
                            <Input placeholder="Area / Locality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landmark (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Near XYZ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardFooter>
              </Card>

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending || isLoading}
                  className="bg-[#4947e0] text-white px-6 py-3 rounded-xl hover:bg-[#3a38c7]"
                >
                  {isLoading ? "Saving..." : "Next"}
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
