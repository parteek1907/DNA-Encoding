import { db } from "./db";
import {
  simulations,
  type Simulation,
  type InsertSimulation,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getSimulations(): Promise<Simulation[]>;
  getSimulation(id: number): Promise<Simulation | undefined>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  deleteSimulation(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(simulations.createdAt);
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    const [simulation] = await db
      .select()
      .from(simulations)
      .where(eq(simulations.id, id));
    return simulation;
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const [simulation] = await db
      .insert(simulations)
      .values(insertSimulation)
      .returning();
    return simulation;
  }

  async deleteSimulation(id: number): Promise<void> {
    await db.delete(simulations).where(eq(simulations.id, id));
  }
}

export class MemStorage implements IStorage {
  private simulations: Map<number, Simulation>;
  currentId: number;

  constructor() {
    this.simulations = new Map();
    this.currentId = 1;
  }

  async getSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulations.values());
  }

  async getSimulation(id: number): Promise<Simulation | undefined> {
    return this.simulations.get(id);
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const id = this.currentId++;
    const simulation: Simulation = { ...insertSimulation, id, createdAt: new Date() };
    this.simulations.set(id, simulation);
    return simulation;
  }

  async deleteSimulation(id: number): Promise<void> {
    this.simulations.delete(id);
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
