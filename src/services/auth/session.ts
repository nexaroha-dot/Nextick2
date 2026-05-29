import "server-only";
import { cookies } from "next/headers";

type SessionData = {
  id: number;
  company_lic: number | null;
  role: "Leader" | "Co Leader" | "Member";
  username: string;
};

const SESSION_COOKIE_NAME = "nestsheet_session";

// In a real production app, this should be signed/encrypted (e.g., using 'jose' for JWT).
// For this MVP, we stringify it to store the session data securely in an HTTP-only cookie.
export async function createSession(data: SessionData) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionValue = JSON.stringify(data);

  (await cookies()).set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  
  try {
    return JSON.parse(sessionCookie) as SessionData;
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
