
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import EditableImage from "./EditableImage";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";


export default function MenuItemForm() {
  

  return (
    <form className="w-1/2 pt-8 flex mx-auto gap-2 justify-center flex-wrap">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage />
        </div>
      </div>

      <div className="grow">
        <div>
          <Label>Item name</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Description</Label>
          <Input type="text" />
        </div>
        <div></div>
        <div>
          <Label>Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Base price</Label>
          <Input type="text" />
        </div>
        <Button className="bg-[#f13a01] text-white mt-4 w-full" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
