import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DNABase as BaseType } from "@shared/schema";

interface DNABaseProps {
  base: BaseType;
  binary: string;
  index: number;
}

const colors: Record<BaseType, string> = {
  A: "bg-[hsl(var(--dna-a))]",
  C: "bg-[hsl(var(--dna-c))]",
  G: "bg-[hsl(var(--dna-g))]",
  T: "bg-[hsl(var(--dna-t))]",
};

const shadows: Record<BaseType, string> = {
  A: "shadow-[0_0_15px_hsl(var(--dna-a)/0.4)]",
  C: "shadow-[0_0_15px_hsl(var(--dna-c)/0.4)]",
  G: "shadow-[0_0_15px_hsl(var(--dna-g)/0.4)]",
  T: "shadow-[0_0_15px_hsl(var(--dna-t)/0.4)]",
};

const labels: Record<BaseType, string> = {
  A: "Adenine",
  C: "Cytosine",
  G: "Guanine",
  T: "Thymine",
};

export function DNABase({ base, binary, index }: DNABaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.05 
      }}
      className="group relative flex flex-col items-center justify-center p-2"
    >
      {/* Connection Line */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10 group-first:hidden" />
      
      {/* Base Tile */}
      <div className={cn(
        "w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-lg md:text-2xl font-bold text-black font-display cursor-pointer transition-all duration-300 hover:-translate-y-1 z-10",
        colors[base],
        shadows[base],
        "border-2 border-white/20 backdrop-blur-sm"
      )}>
        {base}
      </div>

      {/* Binary Tooltip */}
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="px-2 py-1 bg-black/80 text-[10px] md:text-xs font-mono text-primary rounded border border-primary/20">
          {binary}
        </span>
      </div>
      
      {/* Full Name Tooltip */}
      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-[10px] md:text-xs font-medium text-white/50 tracking-wider uppercase">
          {labels[base]}
        </span>
      </div>
    </motion.div>
  );
}
