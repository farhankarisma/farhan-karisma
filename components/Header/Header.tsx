"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } ${
        prevScrollPos > 50 ? "bg-[#F27440]/90 backdrop-blur-sm" : "bg-[#F27440]"
      } flex justify-between p-5 px-4 md:px-8 lg:px-35 items-center`}
    >
      <Image
        src="/suitmedia.jpg"
        alt="Suitmedia Logo"
        width={100}
        height={100}
        className="bg-black z-50"
      />

      {/* Hamburger Button */}
      <button
        className="lg:hidden z-50 flex flex-col gap-1.5 p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
            isMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Navigation Menu */}
      <nav
        className={`${
          isMenuOpen
            ? "fixed inset-0 bg-[#F27440] flex items-center justify-center"
            : "hidden lg:flex"
        }`}
      >
        <ul
          className={`${
            isMenuOpen
              ? "flex flex-col gap-8 items-center text-xl"
              : "flex gap-8"
          }`}
        >
          <li>
            <Link
              href="/ideas"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/ideas" ? "border-b-2 border-white" : ""
              }`}
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/about" ? "border-b-2 border-white" : ""
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/services" ? "border-b-2 border-white" : ""
              }`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/" ? "border-b-2 border-white" : ""
              }`}
            >
              Ideas
            </Link>
          </li>
          <li>
            <Link
              href="/careers"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/careers" ? "border-b-2 border-white" : ""
              }`}
            >
              Careers
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`text-white hover:text-gray-200 transition-colors ${
                pathname === "/contact" ? "border-b-2 border-white" : ""
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
