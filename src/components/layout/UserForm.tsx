
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditableImage from "./EditableImage";
import AddressInput from "./AddressInput"; 
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function UserForm() {


  return (
    <div className="w-1/2 flex mx-auto gap-2 justify-center flex-wrap">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage  />
        </div>
      </div>
      <form className="grow">
        <div>
          <Label  className="text-gray-500">First and last name</Label>
        <Input type="text" placeholder="First and last name" />
        </div>
        <div>
          <Label  className="text-gray-500">Email</Label>
        <Input type="email" placeholder="email" />
        </div>
        
        <AddressInput />
        <div>
          <Label
            className="p-2 inline-flex items-center gap-2 mb-2  text-gray-500"
            htmlFor="adminCb"
          >
            <Checkbox id="adminCb" className="w-4 h-4 " />
            <span>Admin</span>
          </Label>
        </div>
        <Button type="submit" className="w-full">Save</Button>
      </form>
    </div>
  );
}
