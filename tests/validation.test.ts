import { describe, expect, it } from "vitest";
import { contactSchema, partnershipSchema } from "../server/validation.js";

const valid = {
  enquiryType: "general-enquiry",
  fullName: "Mariatu Kamara",
  email: "mariatu@example.com",
  phone: "+232 76 000 000",
  company: "",
  subject: "Business development enquiry",
  message: "I would like to learn more about your venture development service.",
  consent: true,
  website: ""
};

describe("contactSchema", () => {
  it("accepts a complete general enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires an organization for partnerships", () => {
    const result = contactSchema.safeParse({ ...valid, enquiryType: "partnership" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email addresses", () => {
    expect(contactSchema.safeParse({ ...valid, email: "invalid" }).success).toBe(false);
  });

  it("rejects missing consent", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});

const partnershipBase = {
  fullName: "Aminata Conteh",
  email: "aminata@example.com",
  phone: "+232 76 000 001",
  organization: "Example Holdings",
  role: "Managing Director",
  message: "We would like to explore a well-structured partnership with clear responsibilities and outcomes.",
  consent: true,
  website: ""
};

describe("partnershipSchema", () => {
  it.each([
    {
      partnershipType: "strategic-business",
      strategicFocus: "distribution",
      targetMarket: "Sierra Leone",
      strategicContribution: "An established distribution network and experienced field team."
    },
    {
      partnershipType: "investment",
      investorType: "company",
      investmentRange: "50000-250000",
      sectorInterest: "portfolio",
      investmentHorizon: "3-5-years"
    },
    {
      partnershipType: "franchise",
      franchiseVenture: "laundry",
      preferredLocation: "Bo",
      fundingReadiness: "ready",
      businessExperience: "Five years operating a customer services company."
    },
    {
      partnershipType: "corporate-collaboration",
      collaborationFocus: "service-delivery",
      targetTimeline: "Q1 2027",
      projectScope: "A service programme for employees across two offices."
    },
    {
      partnershipType: "technical",
      expertiseArea: "technology",
      deliveryCapacity: "A six-person implementation team available from January.",
      credentials: "Certified engineers with enterprise systems experience."
    },
    {
      partnershipType: "institutional",
      institutionType: "ngo",
      programmeFocus: "enterprise-development",
      geographicScope: "Western Area and Bo District",
      programmeStage: "planning"
    }
  ])("accepts a complete $partnershipType enquiry", (specific) => {
    expect(partnershipSchema.safeParse({ ...partnershipBase, ...specific }).success).toBe(true);
  });

  it("rejects a partnership without its type-specific details", () => {
    expect(partnershipSchema.safeParse({
      ...partnershipBase,
      partnershipType: "investment"
    }).success).toBe(false);
  });

  it("rejects a partnership without consent", () => {
    expect(partnershipSchema.safeParse({
      ...partnershipBase,
      partnershipType: "technical",
      expertiseArea: "technology",
      deliveryCapacity: "A technical delivery team.",
      credentials: "Relevant technical experience.",
      consent: false
    }).success).toBe(false);
  });
});
