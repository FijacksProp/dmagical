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

export function validationMessage(): string {
  return "Please review the highlighted information and try again.";
}
