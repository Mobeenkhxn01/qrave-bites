"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
<<<<<<< HEAD
import { useState } from "react";
import { ContactDialog } from "../ContactDialog";
import { motion } from "framer-motion";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full wave-bg overflow-hidden">

      <div className="mx-auto w-full py-16 lg:py-24 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight">
            Power your restaurant
            <br />
            with <span className="text-blue-400">QraveBites</span>
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[#ae9bf1] text-sm sm:text-base">
            <span>QR Ordering</span>
            <span>Inventory</span>
            <span>Online Store</span>
            <span>Payments</span>
            <span>Analytics</span>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="mt-10 px-14 py-8 rounded-full bg-[#006aff] text-white font-sans text-lg sm:text-xl hover:bg-blue-900 transition"
          >
            Get Started
          </Button>

          <ContactDialog open={open} onOpenChange={setOpen} />
        </motion.div>

        <div className="relative w-full mt-20 overflow-hidden">

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: false, margin: "0px 0px -100px 0px" }}
            className="hidden xl:flex items-center justify-center gap-8 py-20"
          >
            <div className="relative w-[760px] h-[480px] rounded-3xl overflow-hidden -ml-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative w-[250px] h-[420px] rounded-2xl overflow-hidden translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[250px] h-[420px] rounded-2xl overflow-hidden -translate-y-14">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[760px] h-[480px] rounded-3xl overflow-hidden -mr-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
                alt="Restaurant ambience"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="hidden md:flex xl:hidden items-center justify-center gap-6">
            <div className="relative w-[420px] h-[360px] rounded-2xl overflow-hidden -ml-[210px]">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[300px] h-[380px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-[420px] h-[360px] rounded-2xl overflow-hidden -mr-[210px]">
              <Image
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                alt="Burger"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex md:hidden flex-col gap-4 px-4">
            <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative w-full h-[260px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                alt="Food dish"
                fill
                className="object-cover"
              />
            </div>
          </div>

=======
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
>>>>>>> parent of 7363edc (Landing Page)
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
