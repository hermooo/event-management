import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { verifyPassword } from "@/lib/password";
import User from "@/models/User";
import UserSession from "@/models/UserSession";
import type { LoginDto, ApiResponse, IUser, IUserSession } from "@/types";
import { UAParser } from "ua-parser-js";

/**
 * POST /api/auth/login
 * Authenticate a user and create a session
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: LoginDto = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user by email (include password for verification)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Terminate existing sessions for this user (Single session policy)
    await UserSession.deleteMany({ userId: user._id });

    // Get tracking info
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // Parse user agent for device info
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const deviceModel = device.model
      ? `${device.vendor || ""} ${device.model}`.trim()
      : `${os.name || ""} ${os.version || ""}`.trim() || "Unknown Device";

    // Create session (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await UserSession.create({
      userId: user._id,
      ipAddress,
      deviceModel,
      userAgent,
      expiresAt,
    });

    // Convert user to plain object and remove password
    const userObject = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = userObject;

    // Create response with session cookie
    const response = NextResponse.json<ApiResponse<{ user: IUser; session: IUserSession }>>(
      {
        success: true,
        data: {
          user: userWithoutPassword as unknown as IUser,
          session: {
            _id: session._id,
            userId: session.userId,
            ipAddress: session.ipAddress,
            deviceModel: session.deviceModel,
            userAgent: session.userAgent,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
          },
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.cookies.set("session_id", session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    response.cookies.set("session_type", "user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
