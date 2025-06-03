// app/menu-items/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
});

export default function MenuItemDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  useEffect(() => {
    async function fetchMenuItem() {
      try {
        const res = await axios.get(`/api/menu-items`);
        const data = res.data;
        form.reset({
          name: data.name,
          description: data.description,
          price: data.price,
        });
      } catch (err: any) {
        setError("Menu item not found");
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItem();
  }, [id, form]);

  async function onSubmit(values: any) {
    try {
      await axios.put(`/api/menu-items/${id}`, values);
      router.push("/menu-items");
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  async function handleDelete() {
    try {
      await axios.delete(`/api/menu-items/${id}`);
      router.push("/menu-items");
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl mb-4 font-semibold">Edit Menu Item</h1>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <label>Description</label>
          <Textarea {...form.register("description")} />
        </div>
        <div>
          <label>Price</label>
          <Input type="number" {...form.register("price")} />
        </div>
        <div className="flex gap-4">
          <Button type="submit" className="bg-blue-500">
            Save
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="bg-red-600"
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
