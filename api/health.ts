import { sendJson } from "../server/http.js";
import type { VercelRequest, VercelResponse } from "../server/vercel.js";

export default function handler(_request: VercelRequest, response: VercelResponse): void {
  sendJson(response, 200, {
    ok: true,
    message: "D'Magical website API is available.",
    database: process.env.DATABASE_URL ? "configured" : "not_configured",
    email: process.env.RESEND_API_KEY ? "configured" : "not_configured"
  });
}
