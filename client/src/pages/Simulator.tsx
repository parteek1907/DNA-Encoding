import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulations, useCreateSimulation, useDeleteSimulation } from "@/hooks/use-simulations";
import { DNABackground } from "@/components/DNABackground";
import { MappingConfig } from "@/components/MappingConfig";
import { DNAStrand } from "@/components/DNAStrand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FlaskConical, Save, Trash2, History, Share2,
  Binary, Dna, Info, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BinaryMapping, DNABase } from "@shared/schema";
import { defaultMapping } from "@shared/schema";

export default function Simulator() {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState("");
  const [binaryInput, setBinaryInput] = useState("");
  const [mapping, setMapping] = useState<BinaryMapping>(defaultMapping);
  const [mode, setMode] = useState<'text-to-dna' | 'binary-to-text'>('text-to-dna');
  const [saveName, setSaveName] = useState("");
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Queries & Mutations
  const { data: savedSimulations } = useSimulations();
  const createMutation = useCreateSimulation();
  const deleteMutation = useDeleteSimulation();

  // Validate Mapping
  const mappingErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const values = Object.values(mapping);
    const uniqueValues = new Set(values);

    // Check for duplicates
    if (uniqueValues.size !== values.length) {
      Object.entries(mapping).forEach(([key, val]) => {
        if (values.filter(v => v === val).length > 1) {
          errors[key] = "Duplicate binary value";
        }
      });
    }

    // Check length
    Object.entries(mapping).forEach(([key, val]) => {
      if (val.length !== 2) {
        errors[key] = "Must be 2 bits";
      }
    });

    return errors;
  }, [mapping]);

  const isValidMapping = Object.keys(mappingErrors).length === 0;

  // Encoding Logic: Text -> DNA
  const dnaSequence = useMemo(() => {
    if (!isValidMapping || !textInput) return [];

    const sequence: Array<{ base: DNABase; binary: string }> = [];
    const reverseMapping = Object.entries(mapping).reduce((acc, [key, val]) => {
      acc[val] = key as DNABase;
      return acc;
    }, {} as Record<string, DNABase>);

    for (let i = 0; i < textInput.length; i++) {
      const charCode = textInput.charCodeAt(i);
      // Convert to 8-bit binary string
      const binary8 = charCode.toString(2).padStart(8, '0');

      // Split into 4 chunks of 2 bits
      const chunks = binary8.match(/.{1,2}/g) || [];

      chunks.forEach(chunk => {
        const base = reverseMapping[chunk];
        if (base) {
          sequence.push({ base, binary: chunk });
        }
      });
    }
    return sequence;
  }, [textInput, mapping, isValidMapping]);

  // Binary Representation of Text
  const binaryString = useMemo(() => {
    return textInput.split('').map(char =>
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
  }, [textInput]);

  // Mode Switch logic
  const decodedFromBinary = useMemo(() => {
    if (mode !== 'binary-to-text' || !binaryInput) return "";

    // Clean binary input (remove spaces, only 0/1)
    const cleanBinary = binaryInput.replace(/[^01]/g, "");
    let text = "";

    // Process in 8-bit chunks
    for (let i = 0; i < cleanBinary.length; i += 8) {
      const chunk = cleanBinary.slice(i, i + 8);
      if (chunk.length === 8) {
        text += String.fromCharCode(parseInt(chunk, 2));
      }
    }
    return text;
  }, [binaryInput, mode]);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    try {
      await createMutation.mutateAsync({
        name: saveName,
        textInput,
        mappingA: mapping.A,
        mappingC: mapping.C,
        mappingG: mapping.G,
        mappingT: mapping.T,
      });
      setIsSaveOpen(false);
      setSaveName("");
      toast({ title: "Success", description: "Simulation preset saved." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive"
      });
    }
  };

  const loadSimulation = (sim: NonNullable<typeof savedSimulations>[number]) => {
    setTextInput(sim.textInput);
    setMapping({
      A: sim.mappingA,
      C: sim.mappingC,
      G: sim.mappingG,
      T: sim.mappingT,
    });
    setIsHistoryOpen(false);
    toast({ title: "Loaded", description: `Loaded "${sim.name}" preset.` });
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Deleted", description: "Preset removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete" });
    }
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <DNABackground />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              <Dna className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                DNA Encoding
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Digital Information Storage in DNA Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                  <History className="w-4 h-4 mr-2" />
                  Presets
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-white/10 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Saved Simulations</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] mt-4">
                  <div className="space-y-2 pr-4">
                    {savedSimulations?.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">No saved presets yet.</div>
                    )}
                    {savedSimulations?.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => loadSimulation(sim)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 cursor-pointer transition-all group"
                      >
                        <div>
                          <h4 className="font-bold">{sim.name}</h4>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                            {sim.textInput}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                            onClick={(e) => handleDelete(e, sim.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Save Preset</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Save your current configuration and DNA mapping for later use.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="e.g. Greeting Protocol Alpha"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    className="bg-black/50 border-white/10"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSave}
                    disabled={createMutation.isPending || !saveName.trim()}
                    className="bg-primary text-primary-foreground"
                  >
                    {createMutation.isPending ? "Saving..." : "Save Preset"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Panel: Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Step 1: Input */}
            <section className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="text-lg font-semibold">Input Data</h3>
                </div>
                <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                  <Button
                    size="sm"
                    variant={mode === 'text-to-dna' ? 'default' : 'ghost'}
                    onClick={() => setMode('text-to-dna')}
                    className="text-[10px] h-7 px-2"
                  >
                    Text
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === 'binary-to-text' ? 'default' : 'ghost'}
                    onClick={() => setMode('binary-to-text')}
                    className="text-[10px] h-7 px-2"
                  >
                    Binary
                  </Button>
                </div>
              </div>

              {mode === 'text-to-dna' ? (
                <>
                  <Textarea
                    placeholder="Enter text to encode into DNA..."
                    className="bg-black/40 border-white/10 min-h-[120px] font-mono text-sm resize-none focus:ring-primary/50 transition-all"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground font-mono flex justify-between">
                    <span>{textInput.length} chars</span>
                    <span>{textInput.length * 8} bits</span>
                  </div>
                </>
              ) : (
                <>
                  <Textarea
                    placeholder="Enter binary (0101...) to decode into text..."
                    className="bg-black/40 border-white/10 min-h-[120px] font-mono text-sm resize-none focus:ring-primary/50 transition-all"
                    value={binaryInput}
                    onChange={(e) => setBinaryInput(e.target.value)}
                  />
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <p className="text-[10px] text-muted-foreground mb-1 font-mono uppercase tracking-widest">Decoded Result</p>
                    <p className="font-mono text-sm text-primary break-all">
                      {decodedFromBinary || <span className="opacity-40 italic">Waiting for 8-bit chunks...</span>}
                    </p>
                  </div>
                </>
              )}
            </section>

            {/* Step 2: Mapping */}
            <section className="glass-card p-6 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
                <h3 className="text-lg font-semibold">Base Mapping</h3>
              </div>

              {!isValidMapping && (
                <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Unique 2-bit binary values required per base.</span>
                </div>
              )}

              <MappingConfig
                mapping={mapping}
                onUpdate={(k, v) => setMapping(prev => ({ ...prev, [k]: v }))}
                errors={mappingErrors}
              />

              <div className="text-xs text-white/40 leading-relaxed">
                <p>
                  Biological DNA uses 4 nucleotide bases (A, C, G, T).
                  To store digital data, we map binary pairs (00, 01, 10, 11) to these physical molecules.
                </p>
              </div>
            </section>

            {/* Binary Preview */}
            <section className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
                <h3 className="text-lg font-semibold">Binary Encoding</h3>
              </div>
              <div className="bg-black/60 rounded-xl p-4 border border-white/5 min-h-[80px]">
                <p className="font-mono text-xs text-primary/80 break-all leading-relaxed">
                  {binaryString || <span className="text-muted-foreground italic">Waiting for input...</span>}
                </p>
              </div>
            </section>
          </motion.div>

          {/* Right Panel: Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <section className="glass-panel p-1 rounded-3xl flex-1 min-h-[500px] flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  DNA Synthesizer Output
                </h2>
                <div className="flex gap-2 text-xs font-mono">
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Length: {dnaSequence.length} bp</span>
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-primary">Status: {isValidMapping ? 'ACTIVE' : 'ERROR'}</span>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-hidden relative">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                <div className="relative z-10 h-full flex items-center">
                  <DNAStrand sequence={dnaSequence} />
                </div>
              </div>

              {/* Educational Footer */}
              <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-blue-400 mb-1">Did you know?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      One gram of DNA can theoretically store 215 petabytes of data. This simulation demonstrates a simple
                      base-mapping algorithm, similar to early experiments by George Church at Harvard in 2012.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-white/5 text-center text-muted-foreground">
          <p className="text-sm font-medium">
            DNA Encoding and Decoding Simulator | Biology Project 2026
          </p>
          <p className="text-xs mt-1 opacity-60">
            Created for Educational Purposes
          </p>
        </footer>
      </div>
    </div>
  );
}
