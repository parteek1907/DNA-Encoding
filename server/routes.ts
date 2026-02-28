import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET all simulations
  app.get(api.simulations.list.path, async (req, res) => {
    const sims = await storage.getSimulations();
    res.json(sims);
  });

  // GET single simulation
  app.get(api.simulations.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const sim = await storage.getSimulation(id);
    if (!sim) {
      return res.status(404).json({ message: "Simulation not found" });
    }
    res.json(sim);
  });

  // POST create simulation
  app.post(api.simulations.create.path, async (req, res) => {
    try {
      const input = api.simulations.create.input.parse(req.body);
      const sim = await storage.createSimulation(input);
      res.status(201).json(sim);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // DELETE simulation
  app.delete(api.simulations.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const sim = await storage.getSimulation(id);
    if (!sim) {
      return res.status(404).json({ message: "Simulation not found" });
    }
    await storage.deleteSimulation(id);
    res.status(204).send();
  });

  // Initialize seed data
  await seedDatabase();

  return httpServer;
}

// Optional seed function if we want to add a default preset
export async function seedDatabase() {
  const existing = await storage.getSimulations();
  if (existing.length === 0) {
    await storage.createSimulation({
      name: "Standard DNA Encoding",
      textInput: "Hello World",
      mappingA: "00",
      mappingC: "01",
      mappingG: "10",
      mappingT: "11",
    });
  }
}
