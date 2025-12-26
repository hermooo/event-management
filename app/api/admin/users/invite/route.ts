import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { User, InviteToken, Organization } from "@/models";
import { requireAdminAuth } from "@/lib/auth/requireAdminAuth";
import { resend } from "@/lib/resend";
import InviteUserEmail from "@/emails/InviteUserEmail";
import { validateEmail, validateRoles } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Admin
    const { admin } = await requireAdminAuth();

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const { email, name, role, organizationId } = body;

    if (!email || !name || !organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Email validation
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Role validation
    if (role && !validateRoles(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // OrganizationId validation
    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
      return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });
    }

    // Organization validation
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return NextResponse.json({ error: "Invalid organization ID" }, { status: 400 });
    }

    await dbConnect();

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // 4. Create Pending User
    const user = await User.create({
      email,
      name,
      role: role || "staff",
      organizationId,
      status: "pending",
    });

    // 5. Generate Invite Token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 6. Save Token to DB (expires in 48 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    await InviteToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    // 7. Send Invitation Email
    const inviteLink = `${process.env.APP_URL}/setup-password?token=${rawToken}`;

    const { data, error } = await resend.emails.send({
      from: `Evently <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: `You've been invited to join ${organization.name}`,
      react: InviteUserEmail({
        invitedByUsername: admin.name,
        invitedByEmail: admin.email,
        teamName: organization.name,
        inviteLink,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send invitation email" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Invitation sent successfully",
      userId: user._id,
    });
  } catch (error: unknown) {
    console.error("Invite error:", error);
    if (error instanceof Error) {
      if (error.message === "Unauthenticated" || error.message === "Session expired") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
