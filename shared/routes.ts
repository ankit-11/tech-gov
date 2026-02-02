import { z } from 'zod';
import { insertLabSubmissionSchema, labSubmissions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  lab: {
    submit: {
      method: 'POST' as const,
      path: '/api/lab/submit',
      input: insertLabSubmissionSchema,
      responses: {
        201: z.custom<typeof labSubmissions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/lab/latest',
      responses: {
        200: z.custom<typeof labSubmissions.$inferSelect | null>(),
      },
    },
  },
  inspection: {
    verify: {
      method: 'POST' as const,
      path: '/api/inspection/verify',
      input: z.object({ submissionId: z.number() }),
      responses: {
        200: z.object({
          compliant: z.boolean(),
          status: z.string(),
          proofHash: z.string(),
          timestamp: z.string(),
          details: z.object({
            computeCheck: z.boolean(),
            cbrnCheck: z.boolean(),
          })
        }),
        404: errorSchemas.notFound,
      },
    },
    generateReport: {
      method: 'GET' as const,
      path: '/api/inspection/report/:id', // Returns PDF blob
      responses: {
        200: z.any(), // PDF Buffer/Blob
        404: errorSchemas.notFound,
      }
    }
  }
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type SubmitLabDataInput = z.infer<typeof api.lab.submit.input>;
export type VerificationResponse = z.infer<typeof api.inspection.verify.responses[200]>;
