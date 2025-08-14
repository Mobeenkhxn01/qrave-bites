import { Table,TableHeader,TableHead,TableRow,TableBody,TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Trash from "@/components/icons/Trash";
import TitleHeader from "@/components/layout/TitleHeader";
import UserTabs from "@/components/layout/UserTabs";


export default function Orders() {
    return (
        <div className="flex flex-col w-full bg-white py-8">
      <UserTabs />
      <div className="w-1/2 mx-auto p-4">
        <div className="w-full border shadow-md rounded-none overflow-hidden mt-6">
          <Table className="min-w-full ">
            <TableHeader>
              <TableRow className="bg-gray-100 ">
                
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Order Name
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Quantity
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                    Price
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-gray-800 font-extrabold">
                  Method
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              
                <TableRow  className=" cursor-pointer">
                  
                  <TableCell className="px-4 py-8 text-center">
                     
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                    
                  </TableCell>
                  <TableCell className="px-4 py-8 text-center">
                
                  </TableCell>
                </TableRow>
              
            </TableBody>
          </Table>

        
        </div>

      </div>


       
      

    </div>
    );
    }