"use client";
import Contact from "../contact/Contact";
import Explore from "./Explore";
import Hero from "./Hero";
import PopularFood from "./PopularFood";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <PopularFood />
      <Explore/>
      <Contact/>
    </div>
  );
}
