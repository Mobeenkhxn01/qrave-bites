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
import { SelectableList } from "@/components/ui/multi-select";

const LocationMapWithSearch = dynamic(
  () => import("@/components/layout/LocationMapWithSearch"),
  { ssr: false }
);
type SelectableItem = {
  id: string;
  name: string;
};

const CUISINE_ITEMS: SelectableItem[] = [
  { id: "1", name: "North Indian" },
  { id: "2", name: "Chinese" },
  { id: "3", name: "Fast Food" },
  { id: "4", name: "South Indian" },
  { id: "5", name: "Biryani" },
  { id: "6", name: "Pizza" },
  { id: "7", name: "Bakery" },
  { id: "8", name: "Street Food" },
  { id: "9", name: "Burger" },
  { id: "10", name: "Mughlai" },
  { id: "11", name: "Momos" },
  { id: "12", name: "Sandwich" },
  { id: "13", name: "Mithai" },
  { id: "14", name: "Rolls" },
  { id: "15", name: "Beverages" },
  { id: "16", name: "Desserts" },
  { id: "17", name: "Cafe" },
  { id: "18", name: "Healthy Food" },
  { id: "19", name: "Maharashtrian" },
  { id: "20", name: "Tea" },
  { id: "21", name: "Bengali" },
  { id: "22", name: "Ice Cream" },
  { id: "23", name: "Juices" },
  { id: "24", name: "Shake" },
  { id: "25", name: "Shawarma" },
  { id: "26", name: "Gujarati" },
  { id: "27", name: "Italian" },
  { id: "28", name: "Continental" },
  { id: "29", name: "Lebanese" },
  { id: "30", name: "Salad" },
  { id: "31", name: "Andhra" },
  { id: "32", name: "Waffle" },
  { id: "33", name: "Coffee" },
  { id: "34", name: "Kebab" },
  { id: "35", name: "Arabian" },
  { id: "36", name: "Kerala" },
  { id: "37", name: "Asian" },
  { id: "38", name: "Seafood" },
  { id: "39", name: "Pasta" },
  { id: "40", name: "BBQ" },
  { id: "41", name: "Rajasthani" },
  { id: "42", name: "Wraps" },
  { id: "43", name: "Paan" },
  { id: "44", name: "Hyderabadi" },
  { id: "45", name: "Mexican" },
  { id: "46", name: "Bihari" },
  { id: "47", name: "Goan" },
  { id: "48", name: "Assamese" },
  { id: "49", name: "American" },
  { id: "50", name: "Mandi" },
  { id: "51", name: "Chettinad" },
  { id: "52", name: "Mishti" },
  { id: "53", name: "Bar Food" },
  { id: "54", name: "Malwani" },
  { id: "55", name: "Odia" },
  { id: "56", name: "Roast Chicken" },
  { id: "57", name: "Tamil" },
  { id: "58", name: "Japanese" },
  { id: "59", name: "Finger Food" },
  { id: "60", name: "Korean" },
  { id: "61", name: "North Eastern" },
  { id: "62", name: "Thai" },
  { id: "63", name: "Kathiyawadi" },
  { id: "64", name: "Bubble Tea" },
  { id: "65", name: "Mangalorean" },
  { id: "66", name: "Burmese" },
  { id: "67", name: "Sushi" },
  { id: "68", name: "Lucknowi" },
  { id: "69", name: "Modern Indian" },
  { id: "70", name: "Tibetan" },
  { id: "71", name: "Afghan" },
  { id: "72", name: "Oriental" },
  { id: "73", name: "Pancake" },
  { id: "74", name: "Kashmiri" },
  { id: "75", name: "Middle Eastern" },
  { id: "76", name: "Grocery" },
  { id: "77", name: "Konkan" },
  { id: "78", name: "European" },
  { id: "79", name: "Awadhi" },
  { id: "80", name: "Hot dogs" },
  { id: "81", name: "Sindhi" },
  { id: "82", name: "Turkish" },
  { id: "83", name: "Naga" },
  { id: "84", name: "Mediterranean" },
  { id: "85", name: "Nepalese" },
  { id: "86", name: "Cuisine Varies" },
  { id: "87", name: "Saoji" },
  { id: "88", name: "Charcoal Chicken" },
  { id: "89", name: "Steak" },
  { id: "90", name: "Frozen Yogurt" },
  { id: "91", name: "Panini" },
  { id: "92", name: "Parsi" },
  { id: "93", name: "Sichuan" },
  { id: "94", name: "Iranian" },
  { id: "95", name: "Grilled Chicken" },
  { id: "96", name: "French" },
  { id: "97", name: "Raw Meats" },
  { id: "98", name: "Drinks Only" },
  { id: "99", name: "Vietnamese" },
  { id: "100", name: "Liquor" },
  { id: "101", name: "Greek" },
  { id: "102", name: "Himachali" },
  { id: "103", name: "Bohri" },
  { id: "104", name: "Garhwali" },
  { id: "105", name: "Cantonese" },
  { id: "106", name: "Malaysian" },
  { id: "107", name: "Belgian" },
  { id: "108", name: "British" },
  { id: "109", name: "African" },
  { id: "110", name: "Spanish" },
  { id: "111", name: "Manipuri" },
  { id: "112", name: "Egyptian" },
  { id: "113", name: "Sri Lankan" },
  { id: "114", name: "Relief fund" },
  { id: "115", name: "Bangladeshi" },
  { id: "116", name: "Indonesian" },
  { id: "117", name: "Tex-Mex" },
  { id: "118", name: "Irish" },
  { id: "119", name: "Singaporean" },
  { id: "120", name: "South American" },
  { id: "121", name: "Mongolian" },
  { id: "122", name: "German" },
  { id: "123", name: "Russian" },
  { id: "124", name: "Brazilian" },
  { id: "125", name: "Pakistani" },
  { id: "126", name: "Australian" },
  { id: "127", name: "Moroccan" },
  { id: "128", name: "Filipino" },
  { id: "129", name: "Hot Pot" },
  { id: "130", name: "Retail Products" },
  { id: "131", name: "Mizo" },
  { id: "132", name: "Portuguese" },
  { id: "133", name: "Indian" },
  { id: "134", name: "Tripuri" },
  { id: "135", name: "Delight Goodies" },
  { id: "136", name: "Meghalayan" },
  { id: "137", name: "Sikkimese" },
  { id: "138", name: "Armenian" },
  { id: "139", name: "Afghani" },
];

const formSchema = z.object({
  
  cuisine: z
    .array(z.string())
    .min(1, "Select at least one team member")
    .max(3, "You can select up to 3 team members"),
});

export default function NewRestaurantRegister() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

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
      cuisine: [],
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
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="profile-image"
                            name="profileImage"
                            required
                            maxSizeMB={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="profile-image"
                            name="profileImage"
                            required
                            maxSizeMB={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="profile-image"
                            name="profileImage"
                            required
                            maxSizeMB={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="profile-image"
                            name="profileImage"
                            required
                            maxSizeMB={5}
                          />
                        </FormControl>
                      </FormItem>
                    )}
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
                <CardContent className="space-y-6">
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
                            searchPlaceholder="Search cuisine ..."
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
