import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { Admin, AdminSession } from "@/models";
import type { IAdmin } from "@/types";

export interface AdminAuthResult {
  admin: IAdmin;
  sessionId: string;
}

/**
 * Require admin authentication for server-side routes
 * Throws an error if the admin is not authenticated
 * @returns Admin information
 */
export async function requireAdminAuth(): Promise<AdminAuthResult> {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    throw new Error("Unauthenticated");
  }

  // Find active session
  const session = await AdminSession.findOne({
    _id: sessionId,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new Error("Session expired");
  }

  // Find admin
  const admin = await Admin.findById(session.adminId);

  if (!admin) {
    throw new Error("Admin not found");
  }

  // Convert to plain object and remove password
  const adminObject = admin.toObject();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...adminWithoutPassword } = adminObject;

  return {
    admin: adminWithoutPassword as unknown as IAdmin,
    sessionId: sessionId,
  };
}

/**
 * Get current admin if authenticated, returns null if not
 * @returns Admin information or null
 */
export async function getCurrentAdmin(): Promise<AdminAuthResult | null> {
  try {
    return await requireAdminAuth();
  } catch {
    return null;
  }
}

/**
 * Check if admin is authenticated
 * @returns boolean
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    await requireAdminAuth();
    return true;
  } catch {
    return false;
  }
}
