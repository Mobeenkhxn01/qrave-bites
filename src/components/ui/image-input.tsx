"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageInputProps {
  id: string;
  name: string;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
  defaultValue?: string;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
}

export function ImageInput({
  id,
  name,
  className,
  accept = "image/*",
  maxSizeMB = 5,
  required = false,
  defaultValue,
  onChange,
  onError,
}: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(
    defaultValue || null
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ cleanup blob URL (prevents memory leak)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setPreview(null);
      setError(null);
      onChange?.(null);
      return;
    }

    // ✅ Validate type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select a valid image file";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // ✅ Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `Image size should be less than ${maxSizeMB}MB`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // ✅ Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    onChange?.(file);
  };

  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required && !preview}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {!preview ? (
        <div
          onClick={handleClick}
          className="border-2 border-[#256fef] border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
        >
          <ImagePlus className="h-8 w-8 text-[#256fef]" />
          <p className="text-sm text-[#256fef]">
            Click to upload an image
          </p>
          <p className="text-xs text-muted-foreground">
            {accept.replace("image/", "").replace("*", "All images")} (Max:{" "}
            {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="relative w-full h-56 rounded-md overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain bg-black/5"
            unoptimized
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}