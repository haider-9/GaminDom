"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Settings,
  User,
  Star,
  Home,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

const CircularFloatingMenu = () => {
  const [isOpen, setIsOpen] =useState(false); // for menu open/close state
     const [menuRotation, setMenuRotation] = useState(0); // for manual rotation

  // Menu items
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0); // for mobile single icon display

  // Menu items configuration
  const menuItems = [
    { icon: <Home size={20} />, label: "/" },
    { icon: <Gamepad2 size={20} />, label: "Latest" },
    { icon: <Trophy size={20} />, label: "Achievements" },
    { icon: <Star size={20} />, label: "Favorites" },
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  // Calculate positions in a circle with fixed radius
  const radius = 140; // Fixed radius - no scroll-based changes
  const centerAngle = Math.PI / 2 + menuRotation; // Start from top (90 degrees) + manual rotation
  const angleStep = (2 * Math.PI) / menuItems.length;

  // Mobile navigation functions
  const nextMobileItem = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % menuItems.length);
  };

  const prevMobileItem = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  return (
    <div
      className="fixed sm:top-1/2 sm:left-0 sm:-translate-y-1/2 z-50 -bottom-35 left-3 flex items-center justify-center sm:justify-start"
      style={{ width: 380, height: 380 }}
    >
      {/* ===================== PAD BUTTON (center of menu circle) ===================== */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center justify-center">
          {/* Glowing effect behind pad */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 32px 8px var(--color-red), 0 0 64px 16px var(--color-red), 0 0 0 8px rgba(187,59,59,0.15)`,
              zIndex: 0,
              filter: "blur(0.5px)",
            }}
            aria-hidden="true"
          />

          {/* Pad button (gamepad icon only) */}
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            className="rounded-full text-white shadow-lg flex items-center justify-center border-4 border-white relative"
            style={{
              background: "var(--color-red)",
              width: 96,
              height: 96,
              boxShadow: "0 0 0 8px rgba(0,0,0,0.07)",
              zIndex: 1,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle game menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Gamepad2 size={56} />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* ===================== MENU ITEMS & NAVIGATION (only visible when open) ===================== */}
      {isOpen && (
        <>
          {/* Desktop Version - Circular Menu */}
          <div className="hidden sm:block">
            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1/2 -translate-x-1/2 top-4 z-10 opacity-50 hover:opacity-90 transition-all hover:scale-110"
              aria-label="Scroll menu up"
              onClick={() => setMenuRotation((r) => r - angleStep)}
            >
              <ChevronUp
                strokeWidth={2.5}
                className="text-white drop-shadow-sm transition-transform"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-50 hover:opacity-90 transition-all hover:scale-110"
              aria-label="Scroll menu down"
              onClick={() => setMenuRotation((r) => r + angleStep)}
            >
              <ChevronDown
                strokeWidth={2.5}
                className="text-white drop-shadow-sm transition-transform"
              />
            </Button>

            {/* Circular menu items */}
            {menuItems.map((item, index) => {
              const angle = centerAngle + index * angleStep;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              const itemRotation = (menuRotation * 180) / Math.PI + index * (360 / menuItems.length);

              const colorList = [
                "var(--color-red)",
                "var(--color-maroon)",
                "var(--color-black)",
                "var(--color-white)",
                "#6366f1",
                "#f59e42",
              ];
              const bgColor = colorList[index % colorList.length];
              const iconColor = index === 3 ? "var(--color-black)" : "var(--color-white)";

              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    x: 0,
                    y: 0,
                    rotate: -180,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x,
                    y,
                    rotate: itemRotation,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    x: 0,
                    y: 0,
                    rotate: 180,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    mass: 0.7,
                    delay: 0,
                  }}
                >
                  <div className="group relative flex items-center">
                    <Link href={`/${item.label.toLowerCase()}`}>
                      <Button
                        variant="secondary"
                        size="icon"
                        style={{
                          background: bgColor,
                          color: iconColor,
                          borderColor: "var(--color-white)",
                        }}
                        className="shadow-lg rounded-2xl size-12 border-2 cursor-pointer border-white"
                      >
                        {item.icon}
                      </Button>
                    </Link>
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 z-20 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Version - Single Icon Display */}
          <div className="sm:hidden">
            {/* Mobile Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full opacity-70 hover:opacity-100 transition-all hover:scale-110"
              aria-label="Previous item"
              onClick={prevMobileItem}
            >
              <ChevronUp
                strokeWidth={2.5}
                className="text-white drop-shadow-sm -rotate-90"
                size={20}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full opacity-70 hover:opacity-100 transition-all hover:scale-110"
              aria-label="Next item"
              onClick={nextMobileItem}
            >
              <ChevronDown
                strokeWidth={2.5}
                className="text-white drop-shadow-sm -rotate-90"
                size={20}
              />
            </Button>

            {/* Single Mobile Menu Item */}
            <motion.div
              key={currentMobileIndex}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{
                opacity: 0,
                scale: 0.5,
                y: -50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: -120, // Position above the center button
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: 50,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 0.8,
              }}
            >
              <div className="group relative flex flex-col items-center">
                <Link href={`/${menuItems[currentMobileIndex].label.toLowerCase()}`}>
                  <Button
                    variant="secondary"
                    size="icon"
                    style={{
                      background: [
                        "var(--color-red)",
                        "var(--color-maroon)",
                        "var(--color-black)",
                        "var(--color-white)",
                        "#6366f1",
                        "#f59e42",
                      ][currentMobileIndex % 6],
                      color: currentMobileIndex === 3 ? "var(--color-black)" : "var(--color-white)",
                      borderColor: "var(--color-white)",
                    }}
                    className="shadow-2xl rounded-3xl size-16 border-3 cursor-pointer border-white hover:scale-110 transition-all duration-300"
                  >
                    <div className="scale-125">
                      {React.cloneElement(menuItems[currentMobileIndex].icon, { size: 28 })}
                    </div>
                  </Button>
                </Link>
                
                {/* Mobile Label */}
                <span className="mt-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium shadow-lg">
                  {menuItems[currentMobileIndex].label}
                </span>

                {/* Mobile Indicator Dots */}
                <div className="flex gap-1.5 mt-3">
                  {menuItems.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentMobileIndex
                          ? "bg-white scale-125"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default CircularFloatingMenu;