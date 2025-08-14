import Link from "next/link";

export default function ThankYou(){
    return(
        <div className="flex justify-center items-center flex-col">
            <h1>Thank you for registering your restaurant</h1>
            <div className="bg-[#eb0029] p-4 max-w-lg rounded-2xl">
               <Link className="" href={""}>Go to DashBoard</Link> 
            </div>
            
        </div>
    )
}