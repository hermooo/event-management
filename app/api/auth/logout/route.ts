import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserSession from "@/models/UserSession";
import type { ApiResponse } from "@/types";
import { Types } from "mongoose";

/**
 * POST /api/auth/logout
 * Delete a user session (logout)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const sessionId = request.cookies.get("session_id")?.value;

    if (sessionId && Types.ObjectId.isValid(sessionId)) {
      // Attempt to delete the session from DB if it exists
      await UserSession.findByIdAndDelete(sessionId);
    }

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { message: "Logged out successfully" },
      },
      { status: 200 }
    );

    // Clear cookies
    response.cookies.delete("session_id");
    response.cookies.delete("session_type");

    return response;
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
