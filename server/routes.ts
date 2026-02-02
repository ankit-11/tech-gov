import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";
import PDFDocument from "pdfkit"; // We will need to install this

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- Lab API ---

  app.post(api.lab.submit.path, async (req, res) => {
    try {
      const input = api.lab.submit.input.parse(req.body);
      
      // Simulate TEE Hashing/Signing
      const dataString = JSON.stringify(input);
      const signature = crypto.createHash('sha256').update(dataString).digest('hex');

      const submission = await storage.submitLabData({
        ...input,
        signature
      });

      res.status(201).json(submission);
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

  app.get(api.lab.latest.path, async (req, res) => {
    const submission = await storage.getLatestSubmission();
    res.json(submission || null);
  });

  // --- Inspection API ---

  app.post(api.inspection.verify.path, async (req, res) => {
    try {
      const { submissionId } = req.body;
      const submission = await storage.getSubmission(Number(submissionId));

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Compliance Logic
      const COMPUTE_THRESHOLD = 1e25;
      const computeCheck = submission.compute < COMPUTE_THRESHOLD;
      const cbrnCheck = submission.cbrnSafeguards;
      const compliant = computeCheck && cbrnCheck;

      const result = {
        compliant,
        status: compliant ? "PASS" : "FAIL - ARTICLE 88 TRIGGERED",
        proofHash: crypto.createHash('sha256').update(String(submission.id) + String(compliant)).digest('hex'),
        timestamp: new Date().toISOString(),
        details: {
          computeCheck,
          cbrnCheck
        }
      };

      res.json(result);
    } catch (error) {
       res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.inspection.generateReport.path, async (req, res) => {
    const submissionId = Number(req.params.id);
    const submission = await storage.getSubmission(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const COMPUTE_THRESHOLD = 1e25;
    const isCompliant = (submission.compute < COMPUTE_THRESHOLD) && submission.cbrnSafeguards;
    const statusText = isCompliant ? "PASS" : "FAIL - ARTICLE 88 TRIGGERED";
    const statusColor = isCompliant ? "#22c55e" : "#ef4444"; // Green or Red

    // Generate PDF
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AEGIS_Certificate_${submission.id}.pdf`);

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('AEGIS VERIFICATION CERTIFICATE', { align: 'center' });
    doc.moveDown();
    
    // Info
    doc.fontSize(12).font('Helvetica').text(`Issued To: ${submission.labName}`);
    doc.text(`Model: ${submission.modelName}`);
    doc.text(`Date: ${new Date().toISOString()}`);
    doc.text(`Verification Protocol: ISO/IEC 42001 (AI)`);
    doc.moveDown(2);

    // Status
    doc.fontSize(16).font('Helvetica-Bold').fillColor(statusColor).text(`STATUS: ${statusText}`, { align: 'center' });
    doc.fillColor('black'); // Reset color
    doc.moveDown(2);

    // Tech Details
    doc.fontSize(10).font('Courier').text('CRYPTOGRAPHIC PROOF:');
    doc.text(`Signature: ${submission.signature}`);
    doc.text(`Compute Hash: ${crypto.createHash('sha256').update(String(submission.compute)).digest('hex')}`);

    doc.end();
  });

  return httpServer;
}
