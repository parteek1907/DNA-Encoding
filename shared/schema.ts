import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll store saved simulations/presets for the user
export const simulations = pgTable("simulations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Biology 101 Demo"
  textInput: text("text_input").notNull(),
  // Store the 2-bit binary mapping for each base
  mappingA: text("mapping_a").notNull(),
  mappingC: text("mapping_c").notNull(),
  mappingG: text("mapping_g").notNull(),
  mappingT: text("mapping_t").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;

// Types for the Simulator Logic (Shared)
export type DNABase = "A" | "C" | "G" | "T";
export type BinaryMapping = Record<DNABase, string>;

export const defaultMapping: BinaryMapping = {
  A: "00",
  C: "01",
  G: "10",
  T: "11",
};

// API Contract Types
export type CreateSimulationRequest = InsertSimulation;
export type UpdateSimulationRequest = Partial<InsertSimulation>;
