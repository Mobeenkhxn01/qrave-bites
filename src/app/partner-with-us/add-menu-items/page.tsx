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
import { ImageInput } from "@/components/ui/image-input";

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
              <Card className=" w-full">
                <CardHeader>
                  <h1>Complete your registration</h1>
                  <div className="border-t border-gray-300 w-full p-0" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-black border"></div>
                    <div>
                      <h1 className="text-lg text-[#596738]">
                        Restaurant Information
                      </h1>
                      <Link
                        href={"/partner-with-us/new"}
                        className="underline text-extralight text-link text-[#4947e0]"
                      >
                        edit details
                      </Link>
                    </div>
                  </div>
                  <div className="border-l border-gray-300 border-bold h-5"></div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-black border"></div>
                    <div>
                      <h1 className="text-lg text-[#596738]">
                        Menu and operational details
                      </h1>
                      <p className="font-extralight text-gray-500">
                        Menu,dish images and timings
                      </p>
                      <Link
                        href={"/partner-with-us/add-menu-items"}
                        className="underline text-extralight text-link text-[#4947e0]"
                      >
                        edit details
                      </Link>
                    </div>
                  </div>
                  <div className="border-l border-gray-300 border-bold h-5"></div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-black border"></div>
                    <h1 className="text-lg text-[#596738]">
                      Restaurant documents
                    </h1>
                  </div>
                  <div className="border-l border-gray-300 border-bold h-5"></div>
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-black border"></div>
                    <h1 className="text-lg text-[#596738]">Partner contract</h1>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Menu and other operational details
              </h1>

              {/* Restaurant Image Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Add restaurant images
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    <span className="font-bold">
                      Upload at least one entance images{" "}
                    </span>
                    of your restaurant, along with interior images, for your
                    Qravebites page
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageInput
                    id="profile-image"
                    name="profileImage"
                    required
                    maxSizeMB={5}
                  />
                </CardContent>
              </Card>

              {/* Menu Image Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Add food images{" "}
                    <span className="text-muted-foreground font-extralight">
                      (Optional)
                    </span>
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    These images will be shown on your restaurant’s Qravenites
                    dining page.
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageInput
                    id="profile-image"
                    name="profileImage"
                    required
                    maxSizeMB={5}
                  />
                </CardContent>
              </Card>

              {/* Delivery menu Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Add delivery menu items
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    These will be used to create your in-app menu for online
                    ordering.
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageInput
                    id="profile-image"
                    name="profileImage"
                    required
                    maxSizeMB={5}
                  />
                </CardContent>
              </Card>

              {/* Restaurant profile Image Card */}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Add restaurant profile images
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                    This will be your restaurant’s profile picture on Qravebites
                    — so use your best food shot!
                  </p>
                </CardHeader>
                <CardContent>
                  <ImageInput
                    id="profile-image"
                    name="profileImage"
                    required
                    maxSizeMB={5}
                  />
                </CardContent>
              </Card>

              {/*Restaurant Cusines List*/}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Select upto 3 cuisines
                  </h2>
                  <p className="font-extralight text-muted-foreground">
                   Your restaurant will appear in searches for these cuisines
                  </p>
                </CardHeader>
                <CardContent></CardContent>
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
