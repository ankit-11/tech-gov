# AEGIS | International AI Verification System
Website here : https://streamlit-data--samshug.replit.app/

## Project Title
AEGIS: The Protocol for Privacy-Preserving International AI Verification

## Tagline
The Digital IAEA: Verifying global AI safety treaties without revealing model weights or trade secrets.

## Selected Track
Track 4: International Verification & Coordination (Primary)
Track 1: Hardware Verification (Secondary)

---

## 1. Project Summary
International AI treaties are currently unverifiable because nations cannot inspect each other's datacenters without compromising national security or intellectual property. AEGIS (Automated Enforcement & Global Inspection System) solves this "Trust Deadlock." It is a software protocol designed to run inside a Trusted Execution Environment (TEE). It allows an international inspector to deploy a "blind" safety test to a foreign lab's cluster. The code executes, verifies compliance with the $10^{25}$ FLOP threshold and safety Red Lines, and returns a cryptographic Proof of Safety—all without the inspector seeing the weights or the lab seeing the test logic.

---

## 2. Key Features

### AI Lab Interface
* Secure Data Anchoring: Labs submit training compute metrics and safety safeguard status.
* TEE Simulation: Data is cryptographically signed using SHA-256 to simulate Trusted Execution Environment attestation.
* Privacy-Preserving: Only the attestation results and hashes are exposed to the inspection dashboard. 

### International Inspector Interface
* Real-time Monitoring: A global dashboard showing the compliance status of connected lab nodes.
* Automated Inspection: A multi-step verification workflow checking compute thresholds and CBRN safeguards.
* Cryptographic Proof: Every inspection generates a unique proof hash derived from the lab's secure enclave signature.
* Official Certification: Automated PDF certificate generation for compliant models, including cryptographic evidence for the ledger.

---

## 3. Tech Stack
* Frontend: React (Vite), Tailwind CSS, Shadcn UI, Framer Motion, Lucide React.
* Backend: Node.js, Express, TypeScript.
* Database: PostgreSQL (Neon-backed) with Drizzle ORM.
* PDF Generation: PDFKit for official compliance reports.
* Cryptography: Node.js crypto module for secure hashing and signature simulation.

---

## 4. Methodology & Implementation
The system implements a functional prototype to simulate the three-party interaction between Lab, Regulator, and Auditor.

* Simulation: The platform mocks a Trusted Execution Environment (TEE) where Model Cards are stored as encrypted objects.
* Logic: The verification engine checks compute volume against the EU AI Act threshold of $10^{25}$ FLOPs and scans for Red Line capabilities.
* Output: The system generates a JSON-LD Compliance Certificate signed with a hash, ensuring the report cannot be tampered with post-generation.

---

## 5. Compliance Logic
The system enforces the EU AI Act Article 88 and UN AI Safety thresholds:
* Compute Check: Fails if Training Compute $\ge 1.00 \times 10^{25}$ FLOPs.
* Safety Check: Fails if CBRN (Chemical, Biological, Radiological, Nuclear) safeguards are disabled.
* Result: "ARTICLE 88 TRIGGERED" alert for non-compliant models.

---

## 6. Impact & Theory of Change
AEGIS creates the technical possibility for a Digital IAEA. If adopted, it allows nations to sign binding treaties knowing that verification is automated and privacy-preserving. It shifts the equilibrium from High Trust/Low Verification to Zero Trust/High Verification.

---

## 7. Limitations & Dual-Use
* Limitation: The current prototype simulates the TEE (hardware enclave). A production version requires integration with NVIDIA H100 Confidential Computing (CC) mode.
* Dual-Use Risk: While intended for safety, the blind inspection mechanism could theoretically be used by a malicious actor to inject a dormant trigger into a model if the TEE is compromised. This requires strict code signing for all inspection modules.

---

## 8. Getting Started

1. **Installation**:
   ```bash
   npm install
   
2. **Environment Setup**:
   Ensure `DATABASE_URL` is set in your environment variables.

3. **Database Migration**:
   ```bash
   npm run db:push
   
4. **Development**:
   ```bash
   npm run dev
