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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";


import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const LocationMapWithSearch = dynamic(
  () => import('@/components/layout/LocationMapWithSearch'),
  { ssr: false }
);

const formSchema = z.object({
  restaurantname: z.string().min(2).max(50),
  ownername: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.number().min(10).max(15),
  mobile: z.boolean().default(false).optional(),
  shop:z.number().min(1).max(5),
  floor:z.string().min(2).max(50),
  area:z.string().min(2).max(50),
  city:z.string().min(2).max(50),
  landmark:z.string().min(2).max(50),
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
            <aside className="w-1/3">hi</aside>

            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Restaurant Information
              </h1>

              {/* Restaurant Name Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Add Menu Items</h2>
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
              <div className="mt-6 flex justify-end item-center ">
                <div className="">
                  <Button
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
