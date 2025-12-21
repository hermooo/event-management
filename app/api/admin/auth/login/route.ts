import { verifyPassword } from "@/lib/auth/password";
import dbConnect from "@/lib/mongodb";
import { Admin } from "@/models";
import { AdminLoginDto, ApiResponse } from "@/types";
import { NextResponse } from "next/server";

/**
 * POST /api/admin/auth/login
 * Authenticate an admin and create a session
 */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body: AdminLoginDto = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (!admin.password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
