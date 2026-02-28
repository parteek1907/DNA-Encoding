import { motion } from "framer-motion";
import { DNABase } from "./DNABase";
import type { DNABase as BaseType } from "@shared/schema";

interface DNAStrandProps {
  sequence: Array<{ base: BaseType; binary: string }>;
}

export function DNAStrand({ sequence }: DNAStrandProps) {
  if (sequence.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
        <div className="w-16 h-16 rounded-full bg-white/5 mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M2 12h20"/><path d="M2 12c5.523 0 10-4.477 10-10S16.477 12 22 12"/><path d="M2 12c5.523 0 10 4.477 10 10s4.477-10 10-10"/></svg>
        </div>
        <p className="font-mono text-sm">Start typing to generate DNA sequence...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-auto pb-12 pt-8 glass-card rounded-2xl border-white/10">
      <div className="flex items-center min-w-full px-8 gap-4">
        {sequence.map((item, i) => (
          <DNABase 
            key={`${i}-${item.base}`} 
            base={item.base} 
            binary={item.binary} 
            index={i} 
          />
        ))}
      </div>
      
      {/* Decorative Helix Lines */}
      <svg className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 -z-10 opacity-20 pointer-events-none" preserveAspectRatio="none">
        <motion.path
          d="M0,32 Q50,0 100,32 T200,32 T300,32 T400,32 T500,32 T600,32 T700,32 T800,32"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
