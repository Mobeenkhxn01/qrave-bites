"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Plus from "@/components/icons/Plus";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import TitleHeaderPartner from "../titleheader";

const LocationMapWithSearch = dynamic(
  () => import("@/components/layout/LocationMapWithSearch"),
  { ssr: false }
);

const formSchema = z.object({
  restaurantname: z.string().min(2).max(50),
  ownername: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
  mobile: z.boolean().default(false).optional(),
  shop: z.number().min(1).max(5),
  floor: z.string().min(2).max(50),
  area: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  landmark: z.string().min(2).max(50),
});

export default function NewRestaurantRegister() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setLat(lat);
    setLng(lng);
    setAddress(address);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantname: "",
      mobile: true,
    },
  });

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-start gap-6">
            <aside className="w-1/3 p-12 flex justify-center items-end">
              <TitleHeaderPartner
                
                activeStep={1}
              />
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
                            required
                            {...field}
                          />
                        </FormControl>
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
                              required
                              {...field}
                            />
                          </FormControl>
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
                              required
                              {...field}
                            />
                          </FormControl>
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
                        width={512}
                        height={512}
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
                                required
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full flex item-start flex-col justify-center mt-6">
                    <h1 className="text-2xl font-semibold">
                      Restaurant's primary contact number
                    </h1>
                    <p className="font-extralight text-cyan-900">
                      Customers may call on this number for order support
                    </p>
                    <div className="flex font-extralight items-center space-x-2  rounded-2xl ">
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem className="w-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4  ">
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
                    Add your restaurant's location
                  </h2>
                </CardHeader>

                <CardContent className="w-full ">
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
                                required
                                {...field}
                              />
                            </FormControl>
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
                                required
                                {...field}
                              />
                            </FormControl>
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
                                required
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-4 mt-6">
                    <Input
                      type="text"
                      id="landmark"
                      className="h-12"
                      placeholder="Add any nearby landmark (optional)"
                    />
                  </div>
                </CardFooter>
              </Card>
              <div className="mt-6 flex justify-end item-center ">
                <div className="">
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    variant={"outline"}
                    size={"lg"}
                    className="rounded-2xl bg-[#4947e0]"
                  >
                    Next
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
