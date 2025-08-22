import React, { useState } from "react";
import { X } from "lucide-react";

const MenuHintWithArrow: React.FC = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  // Top-center, unobtrusive
  return (
    <div className="hidden lg:block">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-4 py-2 rounded-lg shadow text-xs font-medium select-none flex  items-center gap-2">
        <span>
          Press <span className="font-semibold">Ctrl+M</span> to open menu
        </span>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
          aria-label="Close hint"
          tabIndex={0}
          type="button"
        >
          <X className="w-4 h-4 text-white opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default MenuHintWithArrow;
