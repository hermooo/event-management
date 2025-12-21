import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { AdminSession } from "@/models";
import type { ApiResponse } from "@/types";

/**
 * POST /api/admin/auth/logout
 * Delete an admin session (logout)
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Session ID is required",
        },
        { status: 400 },
      );
    }

    // Delete the session
    await AdminSession.findByIdAndDelete(sessionId);

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
