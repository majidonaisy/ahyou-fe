import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, Prisma } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    // require auth token so we can get organizationId
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let orgId: number | null = null;
    try {
      const jwt = (await import(
        "jsonwebtoken"
      )) as typeof import("jsonwebtoken");
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev-secret"
      ) as unknown;
      if (
        decoded &&
        typeof decoded === "object" &&
        "organizationId" in decoded
      ) {
        const d = decoded as Record<string, unknown>;
        orgId = typeof d.organizationId === "number" ? d.organizationId : null;
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      location,
      speakers,
      category,
      posterUrl,
    } = body;

    if (!title || !date || !time || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // map incoming category strings to enum values
    const categoryMap: Record<string, string> = {
      "محاضرات دينية": "LECTURE",
      "قراءة الأدعية": "PRAYER",
      "مجالس العزاء": "MOURNING",
      "ندوات فقهية": "SEMINAR",
      "مناسبات دينية": "CELEBRATION",
      "دروس تفسير": "LECTURE",
      "أمسيات شعرية": "CELEBRATION",
    };

    const data = {
      title,
      description,
      date: new Date(date),
      time,
      location: typeof location === "object" ? location : { name: location },
      category: (categoryMap[category] as Category) ?? "LECTURE",
      // store speakers array (if provided) as JSON
      speakers: Array.isArray(speakers) ? speakers : undefined,
      posterUrl,
    } as unknown as Prisma.EventCreateInput;

    if (orgId != null) {
      // generated client expects 'Organization' (capitalized) for the relation field
      data.Organization = { connect: { id: orgId } };
    }

    const event = await prisma.event.create({ data });

    return NextResponse.json({ event });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");

    const page = Math.max(1, Number(pageParam) || 1);
    const limit = Math.min(50, Math.max(1, Number(limitParam) || 10));

    const skip = (page - 1) * limit;

    const [total, events] = await Promise.all([
      prisma.event.count(),
      prisma.event.findMany({
        orderBy: { date: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
          location: true,
          category: true,
          posterUrl: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      meta: { total, page, limit, totalPages },
      data: events,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
