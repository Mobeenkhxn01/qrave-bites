"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { MenuItem } from "@prisma/client";

export default function Menu() {
  const [data, setData] = useState<MenuItem[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu-items")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="p-6">
      {data.map((item) => (
        <Card className="w-[250px] h-[350px] p-2 shadow-2xl" key={item.id}>
          <CardHeader className="flex justify-center items-center">
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-justify font-serif">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            aperiam debitis molestiae eum atque commodi! Voluptates aliquid
            obcaecati blanditiis, omnis nam doloremque, ad exercitationem
            inventore soluta excepturi aperiam laudantium ipsam!
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <Button className="bg-[#eb0029] ">Submit</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
