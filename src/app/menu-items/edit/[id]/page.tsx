import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { Button } from "@/components/ui/button";
export default function NewMenuPage() {
    return(
    
    <section>
        
      <UserTabs />
      <div className="flex flex-col items-center">
            <div className="w-1/2 flex items-center justify-center mt-8 text-center border border-gray-300 p-2 rounded-lg">
             <Link href={'/menu'} className="flex flex-row gap-2">
            <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
     
      <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <Button></Button>
        </div>
        </div>
      </div>

    </section>
    );
}