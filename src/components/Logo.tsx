import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const dims = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }[size];

  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-black/40 border border-[#00ff88]/20 shadow-[0_0_20px_rgba(0,255,136,0.08)] ${dims} ${className || ""} transition-all duration-300 hover:border-[#00ff88]/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] group overflow-hidden`}>
      {/* Background cyber-grid line */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
      
      {/* Rotating outer ring */}
      <svg 
        className="absolute inset-0 h-full w-full text-[#00ff88]/30 group-hover:text-[#00ff88]/70 transition-colors duration-300 animate-spin" 
        viewBox="0 0 100 100" 
        style={{ animationDuration: "25s", transformOrigin: "center" }}
      >
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeDasharray="18 10 5 10" 
          fill="none" 
        />
      </svg>

      {/* Cybernetic "T" lettermark */}
      <svg 
        className="h-1/2 w-1/2 text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)] group-hover:scale-110 transition-transform duration-300"
        viewBox="0 0 100 100" 
        fill="currentColor"
      >
        {/* T-Bar & Stem */}
        <path d="M15 20h70v15H60v45H40V35H15V20z" />
        {/* Futuristic accent dot */}
        <circle cx="50" cy="90" r="6" />
      </svg>
    </div>
  );
}
