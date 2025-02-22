

import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";

import Image from "next/image";
import Link from "next/link";
export default async function MenuItemsPage() {  
 
  return (
    <section className=" py-8 relative bottom-0 mb-0 bg-white">
      <UserTabs  />
      <div className="flex flex-col items-center">
        <div className="w-1/2 flex items-center justify-center mt-8 text-center border border-gray-300 p-2 rounded-lg">
        <Link className="flex flex-row gap-2 " href="/menu-items/new">
          <span>Create new menu item</span>
          <Right />
        </Link>
      </div>
      <div className="w-1/2" >
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2">
              <Link
                
                href={`/menu-items/edit/${"1"}`}
                className="bg-gray-200 rounded-lg p-4"
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={""}
                    alt={""}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">Name of Item</div>
              </Link>
           
        </div>
      </div>
      </div>
      
    </section>
  );
}
