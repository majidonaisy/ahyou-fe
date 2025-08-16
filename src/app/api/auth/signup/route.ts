import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, accountType } = body as {
    name: string;
    email: string;
    password: string;
    accountType?: string;
    organizationName?: string;
    organizationDescription?: string;
    location?: {
      region?: string;
      addressDetail?: string;
      mapsLink?: string;
    } | null;
  };

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: accountType === "organization" ? "organizer" : "user",
        },
      });

      let organization = null;
      if (accountType === "organization") {
        const orgName = (body as { organizationName?: string })
          .organizationName;
        const orgDesc = (body as { organizationDescription?: string })
          .organizationDescription;
        const location =
          (
            body as {
              location?: {
                region?: string;
                addressDetail?: string;
                mapsLink?: string;
              };
            }
          ).location ?? undefined;

        if (!orgName) {
          // rollback by throwing
          throw new Error("Missing organizationName for organization signup");
        }

        organization = await tx.organization.create({
          data: {
            userId: user.id,
            name: orgName ?? "",
            description: orgDesc ?? "",
            location: location ?? undefined,
          },
        });
      }

      return { user, organization };
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
      organization: result.organization ?? null,
    });
  } catch (err) {
    console.error(err);
    const message =
      err &&
      (err as Error).message &&
      (err as Error).message.includes("organizationName")
        ? "Missing organization data"
        : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
