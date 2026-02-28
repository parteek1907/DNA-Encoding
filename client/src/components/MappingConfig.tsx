import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { BinaryMapping } from "@shared/schema";
import { motion } from "framer-motion";

interface MappingConfigProps {
  mapping: BinaryMapping;
  onUpdate: (key: keyof BinaryMapping, value: string) => void;
  errors: Record<string, string>;
}

export function MappingConfig({ mapping, onUpdate, errors }: MappingConfigProps) {
  const handleChange = (key: keyof BinaryMapping, value: string) => {
    // Only allow 0 or 1, max length 2
    const clean = value.replace(/[^01]/g, "").slice(0, 2);
    onUpdate(key, clean);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(mapping).map(([base, binary]) => (
        <motion.div 
          key={base}
          whileHover={{ y: -2 }}
          className="relative"
        >
          <div className={`
            absolute -inset-0.5 rounded-lg blur opacity-20 
            bg-[hsl(var(--dna-${base.toLowerCase()}))]
          `} />
          <Card className="relative p-4 bg-black/60 border-white/10 overflow-hidden">
            <div className="flex items-center justify-center mb-4">
              <span className={`
                text-2xl font-bold font-display
                text-[hsl(var(--dna-${base.toLowerCase()}))]
              `}>
                {base}
              </span>
            </div>
            
            <Input
              value={binary}
              onChange={(e) => handleChange(base as keyof BinaryMapping, e.target.value)}
              className={`
                bg-white/5 border-white/10 font-mono text-center tracking-widest text-lg px-2
                focus:border-[hsl(var(--dna-${base.toLowerCase()}))]
                focus:ring-[hsl(var(--dna-${base.toLowerCase()}))]
                ${errors[base] ? 'border-red-500 focus:border-red-500' : ''}
              `}
              placeholder="00"
            />
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
