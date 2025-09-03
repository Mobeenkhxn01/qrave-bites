"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: "Welcome To Qrave Bites",
      description:
        "Scan your table's QR, order instantly. Savor the meal — not the wait.",
      image: "/chicken.png",
    },
    {
      title: "Hot & Fresh Pizza",
      description: "Freshly baked pizzas delivered straight to your table.",
      image: "/beef_burgers.png",
    },
    {
      title: "Delicious Pasta",
      description: "Enjoy creamy, authentic pasta without waiting in line.",
      image: "/chicken.png",
    },
    {
      title: "Tasty Drinks",
      description: "Quench your thirst with our refreshing beverages.",
      image: "/beef_burgers.png",
    },
  ];

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600); // match transition duration
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/bannerBG1_1.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative w-full min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start px-6 lg:px-16 py-12 text-center lg:text-left z-10">
          <div
            key={currentSlide}
            className={`transition-all duration-500 ease-in-out transform ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <h1 className="uppercase font-bold text-2xl md:text-4xl text-orange-400 mb-2 drop-shadow-lg">
              {slides[currentSlide].title}
            </h1>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-2xl">
              {slides[currentSlide].description}
            </h2>
            <Link href="/menu">
              <Button
                
                className="bg-orange-700 w-50  h-20 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Order Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Indicators */}
          <div className="flex gap-3 mt-8">
            {slides.map((_, index) => (
              <Button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "bg-orange-400 w-8 h-3"
                    : "bg-white/40 hover:bg-white/60 w-3 h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Section - Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-6 py-12 z-10">
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
              <div
                key={currentSlide}
                className={`absolute inset-0 transition-all duration-500 ease-in-out transform ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  fill
                  className="object-contain drop-shadow-4xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={handlePrev}
        variant="ghost"
        size="icon"
        className="hidden absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-14 h-14 items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </Button>

      <Button
        onClick={handleNext}
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
