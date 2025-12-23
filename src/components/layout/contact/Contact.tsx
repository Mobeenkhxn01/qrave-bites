import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Contact() {
  return (
    <section className="w-full bg-white font-sans py-20 px-4">
      <div className="mx-auto max-w-5xl flex flex-col items-center text-center gap-8">

        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
          Build and grow your business with QraveBites
        </h1>

        <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis,
          fugit repellendus. Deserunt tempore rem tempora aliquid esse, quia
          nisi dolorem at voluptate eum obcaecati laborum a non, quo temporibus
          doloribus!
        </p>
        <div className="flex gap-4 border p-4 rounded-4xl">
            <Input placeholder="Request Callback" className="border-none"/>
            <Button className="rounded-full bg-blue-600">Request Callback</Button>
        </div>
      </div>
    </section>
  );
}
