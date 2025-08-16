import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      location,
      address,
      organizer,
      contact,
      speaker,
      category,
      posterUrl,
    } = body;

    if (!title || !date || !time || !location || !organizer || !contact) {
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
    };

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location: { name: location, address },
        category: (categoryMap[category] as Category) ?? "LECTURE",
        speaker: speaker ?? "",
        posterUrl
      },
    });

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
        select:{
            title:true,
            date:true,
            time:true,
            location:true,
            category:true,
        }
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
