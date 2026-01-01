"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { MenuItem } from "@prisma/client";
import FoodCard from "./FoodCard";

interface FoodCarouselProps {
  data: MenuItem[];
}

export default function FoodCarousel({ data }: FoodCarouselProps) {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full"
    >
      <CarouselContent>
        {data.map((item) => (
          <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/4">
            <FoodCard item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
