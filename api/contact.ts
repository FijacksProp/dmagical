import { db } from "../server/db.js";
import { sendStaffEmail } from "../server/email.js";
import { preparePost, readBody, sendJson } from "../server/http.js";
import { consumeRateLimit, isHoneypotTriggered } from "../server/security.js";
import { contactSchema, validationMessage } from "../server/validation.js";
import type { VercelRequest, VercelResponse } from "../server/vercel.js";

const enquiryLabels = {
  "general-enquiry": "General enquiry",
  "service-enquiry": "Service enquiry",
  partnership: "Partnership",
  investment: "Investment",
  "venture-enquiry": "Venture enquiry",
  "media-request": "Media request"
} as const;

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (!preparePost(request, response)) return;

  try {
    const parsed = contactSchema.safeParse(readBody(request));
    if (!parsed.success) {
      sendJson(response, 400, { ok: false, message: validationMessage() });
      return;
    }

    if (isHoneypotTriggered(parsed.data.website)) {
      sendJson(response, 201, { ok: true, message: "Thank you. Your enquiry has been received." });
      return;
    }

    if (!await consumeRateLimit(request, "contact", 5, 10 * 60 * 1000)) {
      sendJson(response, 429, { ok: false, message: "Too many enquiries were submitted. Please try again later." });
      return;
    }

    const label = enquiryLabels[parsed.data.enquiryType];
    const sql = db();
    const rows = await sql`
      INSERT INTO contact_messages
        (enquiry_type, full_name, email, phone, company, subject, message)
      VALUES
        (${parsed.data.enquiryType}, ${parsed.data.fullName}, ${parsed.data.email},
         ${parsed.data.phone}, ${parsed.data.company}, ${parsed.data.subject}, ${parsed.data.message})
      RETURNING id
    `;
    const messageId = String(rows[0]?.id);

    const emailStatus = await sendStaffEmail({
      subject: `D'Magical website — ${label}: ${parsed.data.subject}`,
      replyTo: parsed.data.email,
      text: [
        "A new website enquiry was submitted.",
        "",
        `Type: ${label}`,
        `Name: ${parsed.data.fullName}`,
        `Email: ${parsed.data.email}`,
        `Phone: ${parsed.data.phone || "Not provided"}`,
        `Company: ${parsed.data.company || "Not provided"}`,
        `Subject: ${parsed.data.subject}`,
        "",
        parsed.data.message,
        "",
        `Record ID: ${messageId}`
      ].join("\n")
    });

    await sql`
      UPDATE contact_messages
      SET notification_status = ${emailStatus}, updated_at = NOW()
      WHERE id = ${messageId}
    `;

    sendJson(response, 201, {
      ok: true,
      message: "Thank you. Your enquiry has been received. Our team will respond as soon as possible."
    });
  } catch (error) {
    console.error("Contact submission failed", error instanceof Error ? error.name : "UnknownError");
    sendJson(response, 500, {
      ok: false,
      message: "Your enquiry could not be submitted right now. Please try again or contact us by phone."
    });
  }
}
