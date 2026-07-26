function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export const config = {
  databaseUrl: () => required("DATABASE_URL"),
  rateLimitSalt: () => required("RATE_LIMIT_SALT"),
  resendApiKey: () => process.env.RESEND_API_KEY?.trim() || "",
  contactToEmail: () => process.env.CONTACT_TO_EMAIL?.trim() || "info@dmagicaltouchempire.com",
  resendFromEmail: () => process.env.RESEND_FROM_EMAIL?.trim() || "D'Magical Website <onboarding@resend.dev>",
  allowedOrigins: () => (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
