import { verifyPassword } from "@/lib/auth/password";
import dbConnect from "@/lib/mongodb";
import { Admin, AdminSession } from "@/models";
import { AdminLoginDto, ApiResponse, IAdminSession } from "@/types";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

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
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (!admin.password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
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
        }
      );
    }

    // Terminate existing sessions for this admin (Single session policy)
    await AdminSession.deleteMany({ adminId: admin._id.toString() });

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

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const session = await AdminSession.create({
      adminId: admin._id.toString(),
      ipAddress,
      deviceModel,
      userAgent,
      expiresAt,
    });

    const response = NextResponse.json<
      ApiResponse<{ admin: { _id: string; name: string; email: string }; session: IAdminSession }>
    >(
      {
        success: true,
        data: {
          admin: {
            _id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
          },
          session: {
            _id: session._id.toString(),
            adminId: session.adminId,
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

    response.cookies.set("session_type", "admin", {
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
