import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  console.log(user);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  // load organization if exists (to include organizationId in token)
  const organization = await prisma.organization.findUnique({
    where: { userId: user.id },
  });

  // include role and organizationId (if any) in the token
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      organizationId: organization ? organization.id : null,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isOrganizationOwner: !!organization,
    },
  });
}
