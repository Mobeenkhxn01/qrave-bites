import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PartnerWithUs() {
  return (
    <div>
      <div className="flex justify-center items-center p-4">
        <Link href="partner-with-us/new">
          <Button className="font-serif text-white bg-[#eb0029]">
            Register your Restaurant
          </Button>
        </Link>
      </div>
    </div>
  );
}
