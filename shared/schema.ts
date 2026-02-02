import { pgTable, text, serial, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const labSubmissions = pgTable("lab_submissions", {
  id: serial("id").primaryKey(),
  labName: text("lab_name").notNull(),
  modelName: text("model_name").notNull(),
  compute: real("compute").notNull(), // Using real for floating point FLOPs
  cbrnSafeguards: boolean("cbrn_safeguards").notNull().default(false),
  signature: text("signature").notNull(), // Mocked cryptographic signature
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertLabSubmissionSchema = createInsertSchema(labSubmissions).omit({ 
  id: true, 
  createdAt: true,
  signature: true // Generated on backend/simulated
});

// === EXPLICIT API CONTRACT TYPES ===
export type LabSubmission = typeof labSubmissions.$inferSelect;
export type InsertLabSubmission = z.infer<typeof insertLabSubmissionSchema>;

// Request types
export type SubmitLabDataRequest = InsertLabSubmission;

// Response types
export type LabSubmissionResponse = LabSubmission;
export type LatestSubmissionResponse = LabSubmission | null;

export interface VerificationResult {
  compliant: boolean;
  status: string;
  proofHash: string;
  timestamp: string;
  details: {
    computeCheck: boolean;
    cbrnCheck: boolean;
  }
}
