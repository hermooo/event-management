import { NextResponse } from "next/server";
import { Organization } from "@/models";
import { requireAdminAuth } from "@/lib/auth/requireAdminAuth";
import { validateSlug } from "@/lib/validators";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Admin
    await requireAdminAuth();

    // 2. Parse and Validate Request Body
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName || !trimmedSlug) {
      return NextResponse.json(
        { error: "Name and slug cannot be empty or whitespace" },
        { status: 400 }
      );
    }

    if (!validateSlug(trimmedSlug)) {
      return NextResponse.json(
        { error: "Slug can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 3. Check if slug already exists
    const existingOrg = await Organization.findOne({ slug: trimmedSlug });
    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization with this slug already exists" },
        { status: 400 }
      );
    }

    // 4. Create Organization
    const organization = await Organization.create({
      name: trimmedName,
      slug: trimmedSlug,
    });

    return NextResponse.json(
      {
        message: "Organization created successfully",
        data: { organization },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create organization error:", error);
    if (error instanceof Error) {
      if (error.message === "Unauthenticated" || error.message === "Session expired") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Authenticate Admin
    await requireAdminAuth();

    await dbConnect();

    // 2. Fetch all organizations
    const organizations = await Organization.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ organizations });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Unauthenticated" || error.message === "Session expired") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
