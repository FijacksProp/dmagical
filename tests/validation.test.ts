import { describe, expect, it } from "vitest";
import { contactSchema } from "../server/validation.js";

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
