import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import { User, InviteToken } from "@/models";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    // 1. Validate password strength
    const strength = validatePasswordStrength(password);
    if (!strength.isValid) {
      return NextResponse.json({ error: strength.error }, { status: 400 });
    }

    await dbConnect();

    // 2. Hash the incoming token to match stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // 3. Find valid token
    const inviteToken = await InviteToken.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!inviteToken) {
      return NextResponse.json({ error: "Invalid or expired invitation link" }, { status: 400 });
    }

    // 4. Find user
    const user = await User.findById(inviteToken.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Update user password and status
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.status = "active";
    await user.save();

    // 6. Mark token as used
    inviteToken.usedAt = new Date();
    await inviteToken.save();

    return NextResponse.json({
      message: "Password set successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Setup password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
