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
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { days,CUISINE_ITEMS } from "./constant";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageInput } from "@/components/ui/image-input";
import { SelectableList } from "@/components/ui/multi-select";

const formSchema = z.object({
  cuisine: z
    .array(z.string())
    .min(1, "Select at least one team member")
    .max(3, "You can select up to 3 team members"),
  restaurantImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Required image file",
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
  foodImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Required image file",
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
  restaurantProfileImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Required image file",
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
  delieveryImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Required image file",
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
  days: z.array(z.string()).refine((value) => value.some((day) => day), {
    message: "You have to select at least one day",
  }),
});

export default function NewRestaurantRegister() {
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
            {/* Aside tab with option*/}
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


           { /* Step 2 form for restaurant registration*/}
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
                    name="restaurantImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="restaurant-image"
                            name="restaurantImage"
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
                    name="foodImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="food-image"
                            name="foodImage"
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
                    name="delieveryImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="delievery-image"
                            name="delieveryImage"
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
                    name="restaurantProfileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageInput
                            id="restaurant-profile-image"
                            name="restaurantProfileImage"
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





              {/*Restaurant Timing Card*/}
              <Card className="mb-10">
                <CardHeader>
                  <h2 className="text-xl font-semibold">
                    Restaurant opening timing
                  </h2>
                </CardHeader>
                <CardContent className="flex justify-center items-center gap-4 p-4">
                  <div className="grid w-full items-center gap-2">
                    <FormField
                      control={form.control}
                      name="cuisine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Timing</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              id="openingTime"
                              name="openingTime"
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <FormField
                      control={form.control}
                      name="cuisine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closing Timing</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              id="openingTime"
                              name="openingTime"
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <FormField 
                    control={form.control}
                    name="days"
                    render={({field}) => (
                      <FormItem className="flex flex-row gap-2">
                        {days.map((day) => {
                              const isChecked=field.value?.includes(day.id);
                              return (
                                <FormItem key={day.id} className="flex border rounded-2xl p-2 flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        if(checked){
                                           field.onChange([...field.value,day.id]);
                                        }else{
                                           field.onChange(field.value?.filter((val) => val!== day.id));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel>{day.label}</FormLabel>
                                </FormItem>
                              );
                            })}
                          <FormMessage/>
                      </FormItem>
                    )}
                  />
                </CardFooter>
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
