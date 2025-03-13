import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { MenuItem } from "@prisma/client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Plus from "../icons/Plus";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/query-provider";

export default function MenuItemCard() {
  const { data, error, isLoading, isError, isFetching } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () =>
      fetch("/api/menu-items").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu items");
        return res.json();
      }),
  });

  // const mutation = useMutation<
  //   void,
  //   Error,
  //   { id: string; value: string },
  //   unknown
  // >({
  //   mutationFn: async ({ id, value }: { id: string; value: string }) => {
  //     console.log(id, value);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["cart-item"] });
  //   },
  // });

  if (isFetching) {
    return <div>Fetching</div>;
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error.message}
      </div>
    );
  if (!data.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No menu item available</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center flex-col">
      {data.map((item: any) => (
        <Card
          key={item.id}
          className="w-4/5 flex justify-start items-center flex-row border-0  border-b-2 rounded-none shadow-none"
        >
          <CardHeader className=" flex flex-col justify-between">
            <div className="h-32 w-32 relative">
              <Image
                priority
                className="rounded h-32 w-32"
                src={item.image}
                alt={item.name}
                width={512}
                height={512}
              />
            </div>

            <Button>
              Add
              <Plus />
            </Button>
          </CardHeader>
          <div className="flex item-start flex-col">
            <CardFooter>
              <CardTitle className="uppercase">{item.name}</CardTitle>
            </CardFooter>
            <CardContent>
              <div className="flex items-center gap-1 text-green-500">
                <Star className="w-4 h-4 fill-green-500 stroke-none" />
                <span className="font-bold">5.0</span>
                <span className="text-gray-500">(6)</span>
              </div>
              <div className="font-normal ">
                {item.description.split(" ").slice(0, 20).join(" ")}
                {item.description.split(" ").length > 20 && (
                  <p className="text-green-700">see more</p>
                )}
              </div>
              <p className="font-bold">₹{item.price.toFixed(2)}</p>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
