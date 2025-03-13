import { MenuItem } from "@prisma/client";
import { Button } from "../ui/button";

export const AddToCartButton = () => {
  return (
    <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
      Add
    </Button>
  );
};
