
import Hero from "@/components/layout/Hero";
import PopularFood from "@/components/layout/PopularFood";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center ">
       <Hero/>
       <PopularFood/>
       
    </div>
  );
}
