import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddressInput() {
  return (
    <div className="space-y-4"> {/* Added spacing between elements */}
      <div >
        <Label className="text-gray-500">Phone</Label>
        <Input type="tel" placeholder="Phone number" className="mt-1" />
      </div>
      
      <div>
        <Label  className="text-gray-500">Street address</Label>
        <Input type="text" placeholder="Street address" className="mt-1" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label  className="text-gray-500">Postal code</Label>
          <Input type="text" placeholder="Postal code" className="mt-1" />
        </div>
        <div>
          <Label  className="text-gray-500">City</Label>
          <Input type="text" placeholder="City" className="mt-1" />
        </div>
      </div>
      
      <div>
        <Label  className="text-gray-500">Country</Label>
        <Input type="text" placeholder="Country" className="mt-1" />
      </div>
    </div>
  );
}
