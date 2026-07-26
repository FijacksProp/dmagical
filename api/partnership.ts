import { db } from "../server/db.js";
import { sendStaffEmail } from "../server/email.js";
import { preparePost, readBody, sendJson } from "../server/http.js";
import { consumeRateLimit, isHoneypotTriggered } from "../server/security.js";
import { partnershipSchema, validationMessage } from "../server/validation.js";
import type { VercelRequest, VercelResponse } from "../server/vercel.js";

const partnershipLabels = {
  "strategic-business": "Strategic business partnership",
  investment: "Investment partnership",
  franchise: "Franchise partnership",
  "corporate-collaboration": "Corporate collaboration",
  technical: "Technical partnership",
  institutional: "Institutional partnership"
} as const;

const optionLabels: Record<string, string> = {
  "market-access": "Market access",
  distribution: "Distribution",
  technology: "Technology",
  operations: "Operational capability",
  "joint-venture": "Joint venture",
  individual: "Individual investor",
  company: "Company",
  fund: "Investment fund",
  "family-office": "Family office",
  institution: "Institution",
  "under-10000": "Under US$10,000",
  "10000-50000": "US$10,000-50,000",
  "50000-250000": "US$50,000-250,000",
  "250000-plus": "US$250,000+",
  discuss: "Prefer to discuss",
  homecare: "HomeCare",
  laundry: "Laundry Hall",
  logistics: "Procurement & Logistics",
  property: "Property & Real Estate",
  scents: "Magical Scents",
  portfolio: "Portfolio / multiple ventures",
  "under-1-year": "Under 1 year",
  "1-3-years": "1-3 years",
  "3-5-years": "3-5 years",
  "5-plus-years": "5+ years",
  flexible: "Flexible",
  other: "Other",
  ready: "Capital available",
  "partially-ready": "Partially secured",
  "seeking-finance": "Seeking finance",
  exploring: "Exploring requirements",
  "service-delivery": "Service delivery",
  supply: "Supply or procurement",
  campaign: "Campaign or co-branding",
  "employee-benefits": "Employee benefits",
  csr: "CSR or community programme",
  training: "Training & certification",
  compliance: "Legal, compliance or accreditation",
  engineering: "Engineering or infrastructure",
  "specialist-advisory": "Specialist advisory",
  government: "Government or public body",
  ngo: "NGO or development organization",
  education: "Education or research institution",
  finance: "Financial institution",
  "trade-body": "Trade or professional body",
  "enterprise-development": "Enterprise development",
  research: "Research",
  employment: "Employment creation",
  "market-development": "Market development",
  concept: "Concept",
  planning: "Planning",
  funded: "Funded / pre-delivery",
  active: "Active programme"
};

function label(value: string | undefined): string {
  if (!value) return "";
  return optionLabels[value] || value;
}

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (!preparePost(request, response)) return;

  try {
    const parsed = partnershipSchema.safeParse(readBody(request));
    if (!parsed.success) {
      sendJson(response, 400, { ok: false, message: validationMessage() });
      return;
    }

    if (isHoneypotTriggered(parsed.data.website)) {
      sendJson(response, 201, { ok: true, message: "Thank you. Your partnership enquiry has been received." });
      return;
    }

    if (!await consumeRateLimit(request, "partnership", 4, 30 * 60 * 1000)) {
      sendJson(response, 429, {
        ok: false,
        message: "Too many partnership enquiries were submitted. Please try again later."
      });
      return;
    }

    const details: Record<string, string> = {};
    switch (parsed.data.partnershipType) {
      case "strategic-business":
        details["Primary area"] = label(parsed.data.strategicFocus);
        details["Target market or territory"] = parsed.data.targetMarket;
        details["Proposed contribution"] = parsed.data.strategicContribution;
        break;
      case "investment":
        details["Investor type"] = label(parsed.data.investorType);
        details["Indicative investment range"] = label(parsed.data.investmentRange);
        details["Venture area"] = label(parsed.data.sectorInterest);
        details["Investment horizon"] = label(parsed.data.investmentHorizon);
        break;
      case "franchise":
        details["Venture of interest"] = label(parsed.data.franchiseVenture);
        details["Preferred territory"] = parsed.data.preferredLocation;
        details["Funding readiness"] = label(parsed.data.fundingReadiness);
        details["Operating experience"] = parsed.data.businessExperience;
        break;
      case "corporate-collaboration":
        details["Collaboration area"] = label(parsed.data.collaborationFocus);
        details["Preferred start period"] = parsed.data.targetTimeline;
        details["Proposed project"] = parsed.data.projectScope;
        break;
      case "technical":
        details["Primary expertise"] = label(parsed.data.expertiseArea);
        details["Delivery capacity"] = parsed.data.deliveryCapacity;
        details["Credentials and experience"] = parsed.data.credentials;
        break;
      case "institutional":
        details["Institution type"] = label(parsed.data.institutionType);
        details["Programme focus"] = label(parsed.data.programmeFocus);
        details["Geographic scope"] = parsed.data.geographicScope;
        details["Programme stage"] = label(parsed.data.programmeStage);
        break;
    }

    const partnershipLabel = partnershipLabels[parsed.data.partnershipType];
    const detailsJson = JSON.stringify(details);
    const sql = db();
    const rows = await sql`
      INSERT INTO partnership_enquiries
        (partnership_type, full_name, email, phone, organization, role, details, message)
      VALUES
        (${parsed.data.partnershipType}, ${parsed.data.fullName}, ${parsed.data.email},
         ${parsed.data.phone}, ${parsed.data.organization}, ${parsed.data.role},
         ${detailsJson}::jsonb, ${parsed.data.message})
      RETURNING id
    `;
    const enquiryId = String(rows[0]?.id);
    const detailLines = Object.entries(details).map(([key, value]) => `${key}: ${value}`);

    const emailStatus = await sendStaffEmail({
      subject: `D'Magical website - ${partnershipLabel}`,
      replyTo: parsed.data.email,
      text: [
        "A new partnership enquiry was submitted.",
        "",
        `Partnership type: ${partnershipLabel}`,
        `Name: ${parsed.data.fullName}`,
        `Email: ${parsed.data.email}`,
        `Phone: ${parsed.data.phone || "Not provided"}`,
        `Organization: ${parsed.data.organization}`,
        `Role: ${parsed.data.role}`,
        "",
        ...detailLines,
        "",
        "Objectives and expected outcomes:",
        parsed.data.message,
        "",
        `Record ID: ${enquiryId}`
      ].join("\n")
    });

    await sql`
      UPDATE partnership_enquiries
      SET notification_status = ${emailStatus}, updated_at = NOW()
      WHERE id = ${enquiryId}
    `;

    sendJson(response, 201, {
      ok: true,
      message: "Thank you. Your partnership enquiry has been received for review."
    });
  } catch (error) {
    console.error("Partnership submission failed", error instanceof Error ? error.name : "UnknownError");
    sendJson(response, 500, {
      ok: false,
      message: "Your partnership enquiry could not be submitted right now. Please try again or contact us by phone."
    });
  }
}
