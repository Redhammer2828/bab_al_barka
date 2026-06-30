import { useEffect, useState } from "react";
import { EggIcon } from "./EggIcon";

interface EggLoaderProps {
  onComplete: () => void;
}

export function EggLoader({ onComplete }: EggLoaderProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show loader for a minimum of 2.5 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 800); // 800ms for fade out transition
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#6a1322_0%,_#350810_50%,_#150205_100%)] transition-opacity duration-700 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing glow behind egg */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#faf6f0]/10 rounded-full blur-2xl animate-pulse" />

        {/* The Egg */}
        <div className="animate-bounce">
          <EggIcon className="w-20 h-24 text-[#faf6f0] drop-shadow-xl" />
        </div>

        {/* Loading text */}
        <div className="mt-8 overflow-hidden">
          <p className="font-serif text-[#faf6f0] text-xl tracking-widest uppercase animate-pulse">
            Gathering Freshness
          </p>
        </div>

        {/* Progress bar line */}
        <div className="w-32 h-0.5 bg-white/20 mt-4 overflow-hidden rounded-full">
          <div className="h-full bg-[#faf6f0] w-full origin-left animate-[scaleX_2.5s_ease-in-out_forwards]" />
        </div>
      </div>

      {/* Custom keyframe for the progress line */}
      <style>{`
        @keyframes scaleX {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
