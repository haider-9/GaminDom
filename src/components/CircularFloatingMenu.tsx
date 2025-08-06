"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Gamepad2,
  Settings,
  Home,
  Trophy,
  Newspaper,
  TrendingUp,
  Info,
  Menu,
  X,
  LogIn,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const CircularFloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const menuItems = useMemo(() => [
    {
      icon: <Home size={20} />,
      label: "Home",
      route: "/",
      shortcut: "H",
      classes: "bg-red-500 text-red-100 border-red-300 bg-red-500/95 border-red-300/30"
    },
    {
      icon: <Gamepad2 size={20} />,
      label: "Latest",
      route: "/latest",
      shortcut: "L",
      classes: "bg-emerald-500 text-emerald-100 border-emerald-300 bg-emerald-500/95 border-emerald-300/30"
    },
    {
      icon: <Trophy size={20} />,
      label: "Top Rated",
      route: "/top-rated",
      shortcut: "T",
      classes: "bg-yellow-500 text-yellow-100 border-yellow-300 bg-yellow-500/95 border-yellow-300/30"
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Trending",
      route: "/trending",
      shortcut: "R",
      classes: "bg-purple-500 text-purple-100 border-purple-300 bg-purple-500/95 border-purple-300/30"
    },
    {
      icon: <Newspaper size={20} />,
      label: "News",
      route: "/news",
      shortcut: "N",
      classes: "bg-blue-500 text-blue-100 border-blue-300 bg-blue-500/95 border-blue-300/30"
    },
    {
      icon: <Info size={20} />,
      label: "About",
      route: "/about",
      shortcut: "A",
      classes: "bg-cyan-500 text-cyan-100 border-cyan-300 bg-cyan-500/95 border-cyan-300/30"
    },
    {
      icon: <LogIn size={20} />,
      label: "Get Started",
      route: "/get-started",
      shortcut: "G",
      classes: "bg-pink-500 text-pink-100 border-pink-300 bg-pink-500/95 border-pink-300/30"
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      route: "/settings",
      shortcut: "S",
      classes: "bg-slate-500 text-slate-100 border-slate-300 bg-slate-500/95 border-slate-300/30"
    },
  ], []);

  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isOpen && !isMobile) {
        e.preventDefault();
        setRotation(prev => prev + e.deltaY * 0.8);
      }
    };
    if (isOpen && !isMobile) {
      document.addEventListener("wheel", handleWheel, { passive: false });
      return () => document.removeEventListener("wheel", handleWheel);
    }
  }, [isOpen, isMobile]);

  const activeIndex = menuItems.findIndex(item => item.route === pathname);
  const handleDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) {
      setRotation(prev => prev + info.delta.x * 0.8);
    }
  }, [isMobile]);
  const resetRotation = useCallback(() => setRotation(0), []);

  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Open menu with 'M' key on desktop
      if (!isOpen && e.key.toLowerCase() === 'm' && !isMobile && e.ctrlKey ) {
        setIsOpen(true);
        return;
      }

      if (!isOpen) return;

      const key = e.key.toLowerCase();
      const item = menuItems.find(i => i.shortcut.toLowerCase() === key);
      if (item) router.push(item.route);
      if (e.key === "Escape") setIsOpen(false);

      // Only allow rotation on desktop
      if (!isMobile) {
        if (e.key === "ArrowLeft") setRotation(r => r - 45);
        if (e.key === "ArrowRight") setRotation(r => r + 45);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isMobile, menuItems, router]);

  const radius = isMobile ? 90 : 140;
  const centerSize = isMobile ? 220 : 340;
  const menuOffsetX = isMobile ? 0 : -(centerSize / 2 - 80);

  return (
    <>
      {mounted && isOpen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />,
        document.body
      )}

      <motion.div
        ref={containerRef}
        data-menu-container
        className={cn(
          "fixed z-50",
          isMobile ? "bottom-6 left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2",
          "transition-all"
        )}
        style={{ width: isOpen ? centerSize : 64, height: isOpen ? centerSize : 64, left: isMobile ? undefined : isOpen ? menuOffsetX : 24 }}
      >
        <motion.button
          onClick={() => setIsOpen(p => !p)}
          className="absolute w-14 h-14 rounded-full border-2 border-white/20 text-white flex items-center justify-center shadow-2xl z-[999]"
          style={{
            background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))`,
            left: isOpen ? centerSize / 2 - 32 : 0, top: isOpen ? centerSize / 2 - 32 : 0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div className="absolute inset-0 rounded-full bg-white/20 animate-spin" style={{ animationDuration: "20s" }} />
          <motion.div>{isOpen ? <X size={24} /> : <Menu size={24} />}</motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute inset-0"
              drag={!isMobile}
              onDrag={handleDrag}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: isMobile ? 0 : rotation }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <TooltipProvider delayDuration={100}>
                {menuItems.map((item, index) => {
                  const angle = (index * 2 * Math.PI) / menuItems.length - Math.PI / 2;
                  const x = centerSize / 2 + radius * Math.cos(angle);
                  const y = centerSize / 2 + radius * Math.sin(angle);
                  const isActive = activeIndex === index;
                  const [bg, text, bgOpacity] = item.classes.split(" ");
                  const tooltipSide = x > centerSize / 2 ? "left" : "right";

                  return (
                    <motion.div
                      key={item.route}
                      className="absolute"
                      style={{ left: x - 28, top: y - 28 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: isActive ? 1.1 : 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.route} onClick={() => setIsOpen(false)}>
                            <div className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-md text-white relative",
                              bg,
                              "border-white/30 hover:border-white"
                            )}>
                              <motion.div
                                animate={{ rotate: isMobile ? 0 : -rotation }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                  "drop-shadow-sm filter brightness-110",
                                  text
                                )}
                              >
                                {item.icon}
                              </motion.div>
                              <motion.div
                                className="hidden md:flex absolute -top-1 -right-1 w-5 h-5 bg-black/80 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center"
                                animate={{ rotate: isMobile ? 0 : -rotation }}
                                transition={{ duration: 0.3 }}
                              >
                                <span className="text-[10px] font-mono font-semibold text-white/90">
                                  {item.shortcut}
                                </span>
                              </motion.div>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        {!isMobile && (
                          <TooltipContent
                            side={tooltipSide}
                            sideOffset={8}
                            className={cn(
                              "relative px-3 py-2 text-sm font-medium rounded-lg shadow-md",
                              bgOpacity,
                              "text-white border-none",
                              "data-[side=left]:-translate-x-1",
                              "data-[side=right]:translate-x-1"
                            )}
                          >

                            <div className="flex flex-col gap-1 items-start">
                              <div>{item.label}</div>
                              <div className="flex items-center gap-1 text-xs text-white/80">
                                <span>Press</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded font-mono font-bold",
                                  `${bg}/50`,
                                  "text-white"
                                )}>
                                  {item.shortcut}
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>


        {isOpen && (
          <motion.div
            className={cn(
              "absolute z-30",
              isMobile
                ? "bottom-full left-1/2 -translate-x-1/2 mb-4"
                : "top-1/2 left-full ml-4 -translate-y-1/2"
            )}
            initial={{ opacity: 0, y: isMobile ? 10 : 0, x: isMobile ? 0 : -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: isMobile ? 10 : 0, x: isMobile ? 0 : -10 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className={cn(
              "bg-black/80 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl",
              isMobile
                ? "px-4 py-3 flex flex-col gap-2 min-w-[200px]"
                : "px-4 py-3 flex flex-col gap-3 min-w-[220px]"
            )}>
              <div className="flex items-center justify-between">
                <h3 className="text-white/90 font-medium text-sm">Menu Controls</h3>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white/60 text-xs">Active</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="hidden md:block space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Open menu</span>
                    <span className="text-white/50 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded">M</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Drag to rotate</span>
                    <span className="text-white/50 font-mono bg-white/10 px-2 py-0.5 rounded">Mouse</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Scroll to rotate</span>
                    <span className="text-white/50 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded">Wheel</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Arrow keys</span>
                    <span className="text-white/50 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded inline-flex *:size-4"><ArrowLeft /> {" "}<ArrowRight /></span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Close menu</span>
                    <span className="text-white/50 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded">ESC</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Quick access</span>
                    <span className="text-white/50 font-mono font-semibold bg-white/10 px-2 py-0.5 rounded">A-Z</span>
                  </div>
                </div>

                <div className="md:hidden space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Drag to rotate</span>
                    <span className="text-white/50 font-mono bg-white/10 px-2 py-0.5 rounded">Touch</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Tap outside</span>
                    <span className="text-white/50 font-mono bg-white/10 px-2 py-0.5 rounded">Close</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10" />

              {!isMobile && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">Rotation:</span>
                    <span className="font-mono text-white/90 text-sm font-medium bg-white/10 px-2 py-1 rounded">
                      {Math.round(rotation % 360)}°
                    </span>
                  </div>
                  <button
                    onClick={resetRotation}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      rotation === 0
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : "bg-white/10 text-white/80 hover:text-white hover:bg-emerald-500/20"
                    )}
                    disabled={rotation === 0}
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CircularFloatingMenu;