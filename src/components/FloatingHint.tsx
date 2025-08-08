import React from "react";
import { Command } from "lucide-react";

const FloatingHint: React.FC = () => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-black/60 text-white px-3 py-1.5 rounded-lg shadow-md text-xs flex items-center gap-2 border border-white/10 opacity-70 hover:opacity-100 transition-opacity select-none pointer-events-none">
    <Command className="w-4 h-4 text-white opacity-70" />
    <span>
      <span className="font-semibold">Ctrl+M</span> for route menu
    </span>
  </div>
);

export default FloatingHint;
