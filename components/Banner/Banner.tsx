"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const Banner = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
      
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[450px] overflow-hidden">
      <div
        className="relative w-full h-full"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 0 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        >
          <Image
            src="/banner-stock.jpg"
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        
        <div
          className="relative z-10 flex flex-col items-center justify-center h-full text-white"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px)`,
          }}
        >
          <div className="text-center flex flex-col items-center">
            <h1 ref={titleRef} className="text-5xl font-semibold">Ideas</h1>
            <p ref={subtitleRef} className="text-xl">Where all our great things begin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
