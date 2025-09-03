"use client";
import Hero from "./Hero";
import PopularFood from "./PopularFood";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PopularFood />
    </div>
  );
}
