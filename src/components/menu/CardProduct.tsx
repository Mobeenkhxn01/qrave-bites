import Image from "next/image";
import Trash from "../icons/Trash";
import { Button } from "../ui/button";
export default function CardProduct() {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image width={240} height={240} src={"/product.image"} alt={""} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">Product Name</h3>
        <div className="text-sm">
          Size: <span>Product Size Name</span>
        </div>
        <div className="text-sm text-gray-500">
          Quantity: <span>1</span>
      </div>
      </div>
      <div className="text-lg font-semibold">
        <span>$ 100</span>
        </div>
        <div>
            <Button
            className="p-2"
            variant="outline">
                <Trash />
            </Button>
        </div>
    </div>
  );
}
