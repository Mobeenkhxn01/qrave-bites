import React from "react";
import Image from "next/image";
import { IoRestaurant } from "react-icons/io5";

export default function LoadingScreen() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/bannerBG1_1.jpg" // Your background image
          alt="Loading Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
            <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#eb0029] font-bold text-2xl tracking-tighter">
                <IoRestaurant />
              </span>
            </div>

            {/* Rotating ring */}
            <div className="absolute w-24 h-24 border-2 border-transparent border-t-white rounded-full animate-spin-slow"></div>
          </div>
        </div>

        {/* Loading Text with Dots */}
        <div className="text-center">
          <p className="text-white text-lg font-light tracking-wide">
            Loading....
          </p>
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/80 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Brand Tagline */}
      <p className="absolute bottom-8 text-white/70 text-sm font-light z-10">
        Savor the meal, not the wait
      </p>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
