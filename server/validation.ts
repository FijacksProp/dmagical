import { z } from "zod";

const text = (maximum: number) => z.string().trim().min(1).max(maximum);
const optionalText = (maximum: number) => z.string().trim().max(maximum).optional().default("");

export const contactTypes = [
  "general-enquiry",
  "service-enquiry",
  "partnership",
  "investment",
  "venture-enquiry",
  "media-request"
] as const;

export const contactSchema = z.object({
  enquiryType: z.enum(contactTypes),
  fullName: text(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: optionalText(30),
  company: optionalText(160),
  subject: text(140),
  message: text(3000),
  consent: z.literal(true),
  website: optionalText(200)
}).superRefine((data, context) => {
  if (["partnership", "investment"].includes(data.enquiryType) && !data.company) {
    context.addIssue({
      code: "custom",
      path: ["company"],
      message: "Enter the organization or company name."
    });
  }
});

export const partnershipTypes = [
  "strategic-business",
  "investment",
  "franchise",
  "corporate-collaboration",
  "technical",
  "institutional"
] as const;

export const partnershipSchema = z.object({
  partnershipType: z.enum(partnershipTypes),
  fullName: text(120),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: optionalText(30),
  organization: text(160),
  role: text(120),
  message: text(3000),
  consent: z.literal(true),
  website: optionalText(200),

  strategicFocus: z.enum(["market-access", "distribution", "technology", "operations", "joint-venture", "other"]).optional(),
  targetMarket: optionalText(160),
  strategicContribution: optionalText(1200),

  investorType: z.enum(["individual", "company", "fund", "family-office", "institution", "other"]).optional(),
  investmentRange: z.enum(["under-10000", "10000-50000", "50000-250000", "250000-plus", "discuss"]).optional(),
  sectorInterest: z.enum(["homecare", "laundry", "logistics", "property", "scents", "portfolio"]).optional(),
  investmentHorizon: z.enum(["under-1-year", "1-3-years", "3-5-years", "5-plus-years", "flexible"]).optional(),

  franchiseVenture: z.enum(["homecare", "laundry", "logistics", "scents", "other"]).optional(),
  preferredLocation: optionalText(160),
  fundingReadiness: z.enum(["ready", "partially-ready", "seeking-finance", "exploring"]).optional(),
  businessExperience: optionalText(1200),

  collaborationFocus: z.enum(["service-delivery", "supply", "campaign", "employee-benefits", "csr", "other"]).optional(),
  targetTimeline: optionalText(120),
  projectScope: optionalText(1600),

  expertiseArea: z.enum(["technology", "operations", "training", "compliance", "engineering", "specialist-advisory"]).optional(),
  deliveryCapacity: optionalText(240),
  credentials: optionalText(1600),

  institutionType: z.enum(["government", "ngo", "education", "finance", "trade-body", "other"]).optional(),
  programmeFocus: z.enum(["enterprise-development", "training", "research", "employment", "market-development", "other"]).optional(),
  geographicScope: optionalText(160),
  programmeStage: z.enum(["concept", "planning", "funded", "active"]).optional()
}).superRefine((data, context) => {
  const requireText = (value: string, field: string, message: string) => {
    if (!value) context.addIssue({ code: "custom", path: [field], message });
  };
  const requireSelection = (value: string | undefined, field: string, message: string) => {
    if (!value) context.addIssue({ code: "custom", path: [field], message });
  };

  switch (data.partnershipType) {
    case "strategic-business":
      requireSelection(data.strategicFocus, "strategicFocus", "Select the primary partnership area.");
      requireText(data.targetMarket, "targetMarket", "Enter the target market or territory.");
      requireText(data.strategicContribution, "strategicContribution", "Describe the proposed contribution.");
      break;
    case "investment":
      requireSelection(data.investorType, "investorType", "Select the investor type.");
      requireSelection(data.investmentRange, "investmentRange", "Select an indicative investment range.");
      requireSelection(data.sectorInterest, "sectorInterest", "Select a venture area.");
      requireSelection(data.investmentHorizon, "investmentHorizon", "Select an investment horizon.");
      break;
    case "franchise":
      requireSelection(data.franchiseVenture, "franchiseVenture", "Select a venture.");
      requireText(data.preferredLocation, "preferredLocation", "Enter the preferred territory.");
      requireSelection(data.fundingReadiness, "fundingReadiness", "Select the funding readiness.");
      requireText(data.businessExperience, "businessExperience", "Describe the relevant operating experience.");
      break;
    case "corporate-collaboration":
      requireSelection(data.collaborationFocus, "collaborationFocus", "Select a collaboration area.");
      requireText(data.targetTimeline, "targetTimeline", "Enter the preferred start period.");
      requireText(data.projectScope, "projectScope", "Describe the proposed project.");
      break;
    case "technical":
      requireSelection(data.expertiseArea, "expertiseArea", "Select the primary expertise.");
      requireText(data.deliveryCapacity, "deliveryCapacity", "Describe the available delivery capacity.");
      requireText(data.credentials, "credentials", "Describe relevant credentials and experience.");
      break;
    case "institutional":
      requireSelection(data.institutionType, "institutionType", "Select the institution type.");
      requireSelection(data.programmeFocus, "programmeFocus", "Select the programme focus.");
      requireText(data.geographicScope, "geographicScope", "Enter the geographic scope.");
      requireSelection(data.programmeStage, "programmeStage", "Select the programme stage.");
      break;
  }
});

export function validationMessage(): string {
  return "Please review the highlighted information and try again.";
}
