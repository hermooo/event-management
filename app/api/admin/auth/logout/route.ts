import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { AdminSession } from "@/models";
import type { ApiResponse } from "@/types";

/**
 * POST /api/admin/auth/logout
 * Delete an admin session (logout)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const sessionId = request.cookies.get("session_id")?.value;

    if (sessionId) {
      // Attempt to delete the session from DB if it exists
      await AdminSession.findByIdAndDelete(sessionId);
    }

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { message: "Admin logged out successfully" },
      },
      { status: 200 },
    );

    // Clear cookies
    response.cookies.delete("session_id");
    response.cookies.delete("session_type");

    return response;
  } catch (error: unknown) {
    console.error("Admin logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
