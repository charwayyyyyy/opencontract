import { z } from "zod";

// ============================================================
// Common
// ============================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const decimalStringSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid decimal number");

// ============================================================
// Auth
// ============================================================

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([
    "PUBLIC",
    "CONTRACTOR",
    "PROCUREMENT_OFFICER",
    "EVALUATOR",
    "AUDITOR",
    "ADMIN",
  ]),
});

// ============================================================
// Procurement
// ============================================================

export const createProcurementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(500),
  description: z.string().max(5000).optional(),
  procuringEntityId: z.string().cuid("Invalid organization"),
  procurementMethod: z.enum([
    "OPEN_TENDERING",
    "RESTRICTED_TENDERING",
    "REQUEST_FOR_QUOTATION",
    "SINGLE_SOURCE",
    "FRAMEWORK_AGREEMENT",
    "DIRECT_AWARD",
  ]),
  currency: z.string().length(3).default("GHS"),
  estimatedValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount")
    .optional(),
  category: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
});

export const searchProcurementsSchema = z.object({
  q: z.string().max(200).optional(),
  status: z
    .enum([
      "DRAFT",
      "PUBLISHED",
      "OPEN",
      "CLOSED",
      "EVALUATION",
      "AWARDED",
      "CONTRACTED",
      "IMPLEMENTATION",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  method: z
    .enum([
      "OPEN_TENDERING",
      "RESTRICTED_TENDERING",
      "REQUEST_FOR_QUOTATION",
      "SINGLE_SOURCE",
      "FRAMEWORK_AGREEMENT",
      "DIRECT_AWARD",
    ])
    .optional(),
  region: z.string().max(100).optional(),
  minValue: z.coerce.number().min(0).optional(),
  maxValue: z.coerce.number().min(0).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z
    .enum(["publishedAt", "estimatedValue", "title", "createdAt"])
    .default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================
// Tender
// ============================================================

export const createTenderSchema = z
  .object({
    title: z.string().min(5).max(500),
    description: z.string().max(5000).optional(),
    openingDate: z.coerce.date(),
    closingDate: z.coerce.date(),
    procurementMethod: z.enum([
      "OPEN_TENDERING",
      "RESTRICTED_TENDERING",
      "REQUEST_FOR_QUOTATION",
      "SINGLE_SOURCE",
      "FRAMEWORK_AGREEMENT",
      "DIRECT_AWARD",
    ]),
    eligibilityRequirements: z.string().max(5000).optional(),
    evaluationCriteria: z.string().max(5000).optional(),
  })
  .refine((data) => data.closingDate > data.openingDate, {
    message: "Closing date must be after opening date",
    path: ["closingDate"],
  });

// ============================================================
// Bid
// ============================================================

export const submitBidSchema = z.object({
  tenderId: z.string().cuid(),
  notes: z.string().max(2000).optional(),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount")
    .optional(),
});

// ============================================================
// Award
// ============================================================

export const createAwardSchema = z.object({
  procurementId: z.string().cuid(),
  supplierId: z.string().cuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount"),
  currency: z.string().length(3).default("GHS"),
  awardDate: z.coerce.date(),
  justification: z.string().max(5000).optional(),
});

// ============================================================
// Contract
// ============================================================

export const createContractSchema = z.object({
  procurementId: z.string().cuid(),
  supplierId: z.string().cuid(),
  originalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().length(3).default("GHS"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string().max(5000).optional(),
});

export const createAmendmentSchema = z.object({
  contractId: z.string().cuid(),
  reason: z.string().min(10, "Please provide a reason for this amendment").max(2000),
  newAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount"),
  effectiveDate: z.coerce.date(),
  description: z.string().max(5000).optional(),
});

// ============================================================
// Payment
// ============================================================

export const createPaymentSchema = z.object({
  contractId: z.string().cuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid monetary amount"),
  currency: z.string().length(3).default("GHS"),
  paymentDate: z.coerce.date(),
  reference: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
});

// ============================================================
// Milestone
// ============================================================

export const createMilestoneSchema = z.object({
  contractId: z.string().cuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  plannedDate: z.coerce.date(),
});

export const updateMilestoneSchema = z.object({
  completionPct: z.number().int().min(0).max(100),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "DELAYED", "CANCELLED"]),
  actualDate: z.coerce.date().optional(),
});

// ============================================================
// AI Query
// ============================================================

export const aiQuerySchema = z.object({
  question: z
    .string()
    .min(5, "Please enter a question")
    .max(500, "Question is too long"),
  context: z
    .object({
      ocid: z.string().optional(),
    })
    .optional(),
});

// ============================================================
// Export all schemas
// ============================================================

export * from "zod";
