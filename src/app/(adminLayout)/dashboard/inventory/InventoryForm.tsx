"use client";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function InventoryForm({ initialData, onClose, onSave }: any) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: "",
      category: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "pcs",
      cost: 0,
      supplier: "",
    },
  });

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  function submit(values: any) {
    // Basic validation
    if (!values.name || !values.category) {
      toast.error("Please provide name and category");
      return;
    }
    onSave({
      name: values.name,
      category: values.category,
      currentStock: Number(values.currentStock),
      minStock: Number(values.minStock),
      maxStock: Number(values.maxStock),
      unit: values.unit,
      cost: Number(values.cost),
      supplier: values.supplier,
    });
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input {...register("name")} placeholder="Name" />
            <Input {...register("category")} placeholder="Category" />
            <Input {...register("currentStock")} type="number" placeholder="Current stock" />
            <Input {...register("minStock")} type="number" placeholder="Min stock" />
            <Input {...register("maxStock")} type="number" placeholder="Max stock" />
            <Input {...register("unit")} placeholder="Unit (kg/pieces)" />
            <Input {...register("cost")} type="number" step="0.01" placeholder="Cost per unit" />
            <Input {...register("supplier")} placeholder="Supplier" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onClose()}>Cancel</Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
