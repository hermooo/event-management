import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Session from "@/models/Session";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/logout
 * Delete a user session (logout)
 */
export async function POST(request: NextRequest) {
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
    const deletedSession = await Session.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Session not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { message: "Logged out successfully" },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
