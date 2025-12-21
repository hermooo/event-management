import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import User from "@/models/User";
import type { CreateUserDto, ApiResponse, IUser } from "@/types";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: CreateUserDto = await request.json();
    const { organizationId, name, email, password, role } = body;

    // Validate required fields
    if (!organizationId || !name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Missing required fields: organizationId, name, email, password",
        },
        { status: 400 },
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: passwordValidation.error,
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      organizationId,
      name,
      email,
      password: hashedPassword,
      role: role || "staff",
    });

    // Convert to plain object and remove password
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObject;

    return NextResponse.json<ApiResponse<IUser>>(
      {
        success: true,
        data: userWithoutPassword as unknown as IUser,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError" &&
      "errors" in error &&
      error.errors &&
      typeof error.errors === "object"
    ) {
      const messages = Object.values(error.errors as Record<string, { message: string }>).map((err) => err.message);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: messages,
        },
        { status: 400 },
      );
    }

    // Handle duplicate key error (unique constraint violation)
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User with this email already exists in this organization",
        },
        { status: 409 },
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
