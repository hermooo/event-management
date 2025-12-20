import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import type { IUser } from "@/types";

export interface AuthResult {
  user: IUser;
  organizationId: string;
  sessionId: string;
}

/**
 * Require authentication for server-side routes
 * Throws an error if the user is not authenticated
 * @returns User and organization information
 */
export async function requireAuth(): Promise<AuthResult> {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    throw new Error("Unauthenticated");
  }

  // Find active session
  const session = await Session.findOne({
    _id: sessionId,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new Error("Session expired");
  }

  // Find user
  const user = await User.findById(session.userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Convert to plain object and remove password
  const userObject = user.toObject();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userObject;

  return {
    user: userWithoutPassword as unknown as IUser,
    organizationId: user.organizationId,
    sessionId: sessionId,
  };
}

/**
 * Get current user if authenticated, returns null if not
 * @returns User information or null
 */
export async function getCurrentUser(): Promise<AuthResult | null> {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns boolean
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    await requireAuth();
    return true;
  } catch {
    return false;
  }
}
