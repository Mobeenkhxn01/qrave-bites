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

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Right from "@/components/icons/Right";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageInput } from "@/components/ui/image-input";
import { SelectableList } from "@/components/ui/multi-select";
import TitleHeaderPartner from "../titleheader";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// You can define the form validation schema here.
// Currently empty, but you can add fields later.
const formSchema = z.object({
  // Example field:
  // acceptTerms: z.boolean().refine(val => val === true, "You must accept terms"),
});

export default function NewRestaurantRegister() {
  // onSubmit handler, receives validated form data
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Use form values here - e.g., send to API or update state
    console.log("Form submitted with values:", values);
  }

  // Initialize react-hook-form with Zod resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisine: [], // example default value
    },
  });

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-start gap-6">
            {/* Left side tab / stepper */}
            <aside className="w-1/3 p-12 flex justify-center items-end">
              <TitleHeaderPartner activeStep={4} />
            </aside>

            {/* Main form section */}
            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Partner Contract and Agreement
              </h1>

              <Card className="mb-10 p-4">
                <ScrollArea className="h-screen w-full border rounded-md overflow-y-auto">
                  <CardContent className="p-4">
                    {/* Your contract text here */}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Distinctio, est? Esse commodi ad hic beatae officiis placeat
                    omnis enim. Quia impedit commodi fugiat laboriosam eum
                    necessitatibus optio facere est enim.
                    <br />
                    Quidem cumque eum asperiores assumenda, aperiam ullam
                    facilis unde voluptates maiores ad quas deserunt nam, animi
                    nemo optio doloribus...
                    {/* continue your text */}
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Natus saepe illum molestias earum rerum cum modi obcaecati,
                    dolore repudiandae veritatis id minus facere sunt
                    reprehenderit totam nihil neque doloremque fuga? Quisquam
                    est, dolor voluptatum aliquam consequatur reiciendis nemo
                    repellat temporibus, laborum quo cupiditate praesentium
                    vitae. Facere dolores alias quidem dignissimos voluptas
                    dolore. Voluptas natus velit itaque fugit excepturi cumque
                    labore. Sequi aperiam recusandae facilis cupiditate eum
                    totam porro dolore ea illo quam libero consequatur voluptas,
                    tempora architecto temporibus excepturi adipisci facere
                    nesciunt corrupti eos officia. Expedita autem ad quibusdam
                    quasi. Quia exercitationem possimus omnis deleniti quisquam?
                    Reiciendis suscipit pariatur ad, numquam, distinctio
                    adipisci nesciunt nostrum molestiae repellat fugit illo
                    earum iure non a natus at! Rerum illum harum repellendus
                    nam! Labore quibusdam voluptatem veritatis explicabo saepe
                    nihil totam, mollitia voluptatibus possimus odit reiciendis
                    velit, eum ut architecto optio animi, excepturi minima.
                    Molestiae atque earum sequi dolorum consequuntur ea
                    blanditiis delectus. Quia accusantium incidunt alias itaque
                    corporis odit officiis quos obcaecati minima! Neque totam
                    ullam ex aliquid exercitationem dicta odit, fugit deserunt
                    suscipit excepturi enim tenetur temporibus mollitia! In, aut
                    illum? Iste repellendus tenetur asperiores est laborum.
                    Neque alias repellendus maxime, nemo ea vero at eaque eius
                    molestias odit aspernatur mollitia non ducimus, cumque,
                    fugiat minima quia aperiam ex amet culpa. Maiores assumenda
                    ipsa debitis, quos perferendis necessitatibus, numquam
                    placeat laboriosam expedita praesentium sint optio tempora
                    dolores id architecto molestias! Non, assumenda. Alias eum
                    ipsum quis officia amet ad autem magni. Non quasi autem
                    ratione aspernatur possimus perferendis, nobis unde quae
                    voluptatibus laboriosam, deserunt aut eveniet voluptatem
                    dolorem ab minima fuga dolorum maxime obcaecati doloremque
                    voluptas architecto! Laboriosam dolor nemo quae. Provident,
                    beatae. Ea sapiente eius assumenda, harum voluptates modi
                    quos minima accusamus eos aut accusantium iusto. Amet sint,
                    quos dignissimos quam ipsum, commodi itaque est deserunt
                    rerum error veniam incidunt. Veniam facilis saepe provident
                    commodi nam eius iste dignissimos ut illo voluptate deserunt
                    modi quasi, consequuntur accusamus ad quaerat explicabo
                    temporibus optio, numquam odio, non neque tenetur. Tempora,
                    eligendi hic. Laborum maiores qui voluptas minus quia nam
                    blanditiis porro laboriosam mollitia dolorem! Impedit
                    consequatur nemo, neque esse optio ipsa quasi quae beatae
                    quod suscipit voluptates similique exercitationem non nam
                    unde! Ratione quod vero possimus distinctio doloribus hic
                    incidunt odit natus, amet dicta culpa deserunt debitis sed
                    eligendi eos! Aliquid reiciendis perferendis esse natus
                    corrupti earum, dolorem tenetur deleniti nulla ab! Facilis
                    magni cumque dolores sint repellat commodi adipisci
                    asperiores nostrum dolorum aperiam praesentium ad
                    perspiciatis corrupti temporibus labore rem, vel modi
                    distinctio, doloribus doloremque incidunt. Tenetur
                    voluptates amet quaerat perferendis! Tenetur molestiae
                    quaerat dignissimos et aliquid corporis nulla sunt
                    perspiciatis magnam vitae omnis nostrum nemo cum quos, ex a
                    aperiam minus commodi quisquam doloremque tempore optio
                    facere minima id. Eum? Odit laudantium autem sed earum
                    praesentium voluptas aspernatur ad enim fugit voluptatum
                    eligendi ratione est, necessitatibus illo sunt, veniam quod,
                    officiis rerum nesciunt ipsa provident natus! Dolorum minus
                    eaque repudiandae! Et iure minus qui quam, fugiat cum in
                    sint dicta tenetur nemo suscipit vitae numquam ipsam ut?
                    Necessitatibus molestiae nihil, vitae mollitia ipsa
                    consequuntur sequi unde obcaecati sit. Nam, fugit? Ipsa,
                    beatae nesciunt quas iste saepe sint. Quisquam est
                    laboriosam nobis repellendus consequatur amet error ab
                    mollitia quos suscipit aut accusantium, placeat nihil esse,
                    voluptatem ea ut incidunt cupiditate perferendis! Pariatur,
                    beatae praesentium sint nam provident ipsum. Nemo,
                    accusantium voluptatem! Dicta ad error voluptas, nesciunt
                    odit quae molestias delectus ut dignissimos cumque cum in
                    consequuntur minus. Vitae voluptatibus quod repudiandae? Qui
                    magnam tempore magni soluta eligendi. Similique sequi
                    aliquid veritatis natus, animi nulla facilis necessitatibus
                    placeat tenetur fuga eaque quaerat cum ab cupiditate dolorum
                    beatae, ut ex mollitia sed. Minus.\
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* Submit / Next button aligned right */}
              <div className="mt-6 flex justify-end items-center">
                <Button
                  type="submit"
                  variant={"outline"}
                  size={"lg"}
                  className="rounded-2xl bg-[#4947e0]"
                >
                  Next
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
