import { Resend } from "resend";
import { config } from "./config.js";

export type NotificationStatus = "sent" | "not_configured" | "failed";

interface StaffEmail {
  subject: string;
  replyTo: string;
  text: string;
}

export async function sendStaffEmail(email: StaffEmail): Promise<NotificationStatus> {
  const apiKey = config.resendApiKey();
  if (!apiKey) return "not_configured";

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: config.resendFromEmail(),
      to: config.contactToEmail(),
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text
    });

    return result.error ? "failed" : "sent";
  } catch (error) {
    console.error("Resend notification failed", error instanceof Error ? error.name : "UnknownError");
    return "failed";
  }
}
