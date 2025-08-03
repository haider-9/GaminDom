"use client";
import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuRotation, setMenuRotation] = useState(0); // for manual scroll

  // Listen to scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu items configuration
  const menuItems = [
    { icon: <Home size={20}/>, label: "Home" },
    { icon: <Gamepad2 size={20} />, label: "Games" },
    { icon: <Trophy size={20} />, label: "Achievements" },
    { icon: <Star size={20} />, label: "Favorites" },
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  // Calculate positions in a circle, spread more (increased base and spread)
  const baseRadius = 140; // increased for more spread
  const spread = Math.min(scrollY / 2, 200); // more aggressive spread
  const radius = baseRadius + spread;
  const centerAngle = Math.PI / 2 + menuRotation; // Start from top (90 degrees) + manual rotation
  const angleStep = (2 * Math.PI) / menuItems.length;

  return (
    <div
      className="fixed sm:top-1/2 sm:left-0 sm:-translate-y-1/2  z-50 -bottom-35 left-3 flex items-center justify-center sm:justify-start"
      style={{ width: 380, height: 380 }}
    >
      {/* ===================== PAD BUTTON (center of menu circle) ===================== */}
      {(() => {
        // Use the first color from colorList for the pad
        return (
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
        );
      })()}

      {/* ===================== MENU ITEMS & SCROLL BUTTONS (only visible when open) ===================== */}
      {isOpen && (
        <>
          {/* Top scroll icon - icon only, low opacity */}

          {/* Left-side icon on small screens, top-center on large screens */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute  top-4 left-4 sm:left-1/2 sm:-translate-x-1/2 z-10 opacity-50 hover:opacity-90 transition-all hover:scale-110"
            aria-label="Scroll menu up"
            onClick={() => setMenuRotation((r) => r - angleStep)}
          >
            <ChevronUp
              strokeWidth={2.5}
              className="text-white drop-shadow-sm -rotate-90 sm:rotate-0 transition-transform"
            />
          </Button>

          {/* Right-side icon on small screens, bottom-center on large screens */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:top-auto z-10 opacity-50 hover:opacity-90 transition-all hover:scale-110"
            aria-label="Scroll menu down"
            onClick={() => setMenuRotation((r) => r + angleStep)}
          >
            <ChevronDown
              strokeWidth={2.5}
              className="text-white drop-shadow-sm -rotate-90 sm:rotate-0 transition-transform"
            />
          </Button>

          {/* Circular menu items (around the pad) */}
          {menuItems.map((item, index) => {
            const angle = centerAngle + index * angleStep;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            // Smooth continuous rotation based on scroll and menuRotation
            const scrollRotate =
              (scrollY / 3 +
                (menuRotation * 180) / Math.PI +
                index * (360 / menuItems.length)) %
              360;
            const scrollZ = Math.min(scrollY / 2, 200); // pop out more as you scroll

            // Use primary and accent colors from globals.css
            const colorList = [
              "var(--color-red)",
              "var(--color-maroon)",
              "var(--color-black)",
              "var(--color-white)",
              "#6366f1", // indigo-500 as accent
              "#f59e42", // orange accent
            ];
            const bgColor = colorList[index % colorList.length];
            const iconColor =
              index === 3 ? "var(--color-black)" : "var(--color-white)";

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
                  z: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x,
                  y,
                  rotate: scrollRotate,
                  z: scrollZ,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                  rotate: 180,
                  z: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.7,
                  delay: 0,
                }}
                style={{ perspective: 600 }}
              >
                {/* Tooltip wrapper */}
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
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-8 z-20 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CircularFloatingMenu;
