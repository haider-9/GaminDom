"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import Link from "next/link";

const CircularFloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Menu items configuration
  const menuItems = [
    { 
      icon: <Home size={20} />, 
      label: "Home", 
      route: "/", 
      color: "#bb3b3b",
      description: "Main dashboard"
    },
    { 
      icon: <Gamepad2 size={20} />, 
      label: "Latest", 
      route: "/latest", 
      color: "#059669",
      description: "New releases"
    },
    { 
      icon: <Trophy size={20} />, 
      label: "Top Rated", 
      route: "/top-rated", 
      color: "#dc2626",
      description: "Best games"
    },
    { 
      icon: <TrendingUp size={20} />, 
      label: "Trending", 
      route: "/trending", 
      color: "#7c3aed",
      description: "Popular now"
    },
    { 
      icon: <Newspaper size={20} />, 
      label: "News", 
      route: "/news", 
      color: "#ea580c",
      description: "Gaming news"
    },
    { 
      icon: <Info size={20} />, 
      label: "About", 
      route: "/about", 
      color: "#0891b2",
      description: "Learn more"
    },
    { 
      icon: <LogIn size={20} />, 
      label: "Get Started", 
      route: "/get-started", 
      color: "#be185d",
      description: "Join us"
    },
    { 
      icon: <Settings size={20} />, 
      label: "Settings", 
      route: "/settings", 
      color: "#4b5563",
      description: "Preferences"
    },
  ];

  // Check if current route matches any menu item
  const activeIndex = menuItems.findIndex(item => item.route === pathname);

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);



  // Close menu when clicking outside or navigating
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-menu-container]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Desktop circular menu layout
  const DesktopMenu = () => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    return (
      <div className="relative w-[300px] h-[300px]">
        {/* Menu Items in Circle */}
        <AnimatePresence>
          {menuItems.map((item, index) => {
            const angle = (index * 2 * Math.PI) / menuItems.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={item.route}
                className="absolute"
                style={{
                  left: x - 24,
                  top: y - 24,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, scale: 0 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="group relative">
                  <Link href={item.route} onClick={() => setIsOpen(false)}>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-white shadow-xl' 
                          : 'border-white/50 hover:border-white'
                      }`}
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: isActive 
                          ? `0 0 20px ${item.color}50, 0 4px 15px rgba(0,0,0,0.3)` 
                          : '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                  </Link>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-white/20">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-white/70">{item.description}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  // Mobile grid menu - shows all items in a compact grid
  const MobileMenu = () => {
    return (
      <div className="w-full max-w-sm mx-auto">
        {/* Grid of all menu items */}
        <div className="grid grid-cols-4 gap-3">
          {menuItems.map((item, index) => {
            const isActive = activeIndex === index;
            
            return (
              <motion.div
                key={item.route}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: index * 0.05 }
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Link href={item.route} onClick={() => setIsOpen(false)}>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 mb-2 ${
                      isActive 
                        ? 'border-white shadow-xl' 
                        : 'border-white/40 hover:border-white/70'
                    }`}
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: isActive 
                        ? `0 0 15px ${item.color}40, 0 4px 12px rgba(0,0,0,0.3)` 
                        : '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div className="text-white">
                      {React.cloneElement(item.icon, { size: 18 })}
                    </div>
                  </div>
                </Link>
                
                {/* Label */}
                <span className={`text-xs text-center leading-tight transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-white/70'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Active item description */}
        {activeIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
              <div className="text-white/60 text-xs">
                {menuItems[activeIndex].description}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className={`fixed z-50 ${
          isMobile 
            ? 'bottom-6 left-6' 
            : 'top-1/2 left-6 -translate-y-1/2'
        }`}
        data-menu-container
      >
        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-full opacity-75"
          style={{
            background: `radial-gradient(circle, ${isOpen ? '#bb3b3b' : 'transparent'} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
          }}
        />

        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-[#bb3b3b] to-[#bb3b3b]/80 rounded-full shadow-2xl border-3 border-white flex items-center justify-center text-white overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: '0 8px 32px rgba(187, 59, 59, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          
          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: isOpen ? 2 : 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </motion.div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`fixed z-45 ${
                isMobile
                  ? 'bottom-28 left-6 right-6'
                  : 'top-1/2 left-28 -translate-y-1/2'
              }`}
              data-menu-container
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">GaminDom</h3>
                  <p className="text-white/60 text-sm">Navigate your gaming world</p>
                </div>

                {/* Menu Content */}
                {isMobile ? <MobileMenu /> : <DesktopMenu />}

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">
                    {menuItems.length} destinations available
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CircularFloatingMenu;