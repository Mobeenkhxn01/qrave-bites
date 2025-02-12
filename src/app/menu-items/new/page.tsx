import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import MenuItemForm from "@/components/layout/MenuItemForm";
export default function NewMenuPage() {
    return( 
        <section className=" py-8 relative bottom-0 mb-0 bg-white">
        <UserTabs  />
        <div className="flex flex-col items-center">
            <div className="w-1/2 flex items-center justify-center mt-8 text-center border border-gray-300 p-2 rounded-lg">
             <Link href={'/menu'} className="flex flex-row gap-2">
            <Left />
            <span>Show all menu items</span>
          </Link>   
            </div>
          
        </div>
        <MenuItemForm  />
      </section>

    );
}