import React from "react";

 const Spinner: React.FC<{ className?: string }> = ({ className = "h-10 w-10 mb-2" }) => (
  <div className={`flex items-center justify-center space-x-1 ${className}`}>
    <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.32s]"></span>
    <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.16s]"></span>
    <span className="inline-block w-3 h-3 bg-primary rounded-full animate-bounce"></span>
  </div>
);

export default Spinner;
