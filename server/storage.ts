import { db } from "./db";
import {
  labSubmissions,
  type LabSubmission,
  type InsertLabSubmission
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Lab Operations
  submitLabData(data: InsertLabSubmission & { signature: string }): Promise<LabSubmission>;
  getLatestSubmission(): Promise<LabSubmission | undefined>;
  getSubmission(id: number): Promise<LabSubmission | undefined>;
}

export class DatabaseStorage implements IStorage {
  async submitLabData(data: InsertLabSubmission & { signature: string }): Promise<LabSubmission> {
    const [submission] = await db
      .insert(labSubmissions)
      .values(data)
      .returning();
    return submission;
  }

  async getLatestSubmission(): Promise<LabSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(labSubmissions)
      .orderBy(desc(labSubmissions.createdAt))
      .limit(1);
    return submission;
  }

  async getSubmission(id: number): Promise<LabSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(labSubmissions)
      .where(eq(labSubmissions.id, id));
    return submission;
  }
}

export const storage = new DatabaseStorage();
