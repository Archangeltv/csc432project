import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../prisma";
import { domain } from "@/lib/domain";
import qs from "qs";

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const limit = Number.parseInt(searchParams.get("limit"));
  const urlRecord = await Prisma.Traffic.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      link: true,
    },
    take: limit
  });
  if (!urlRecord) return new NextResponse(JSON.stringify({ error: "No data found" }),{status: 404,})
  
  console.log(urlRecord);
  return new NextResponse(
    JSON.stringify({ data: urlRecord, message: "MATCH FOUND" }),
    {
      status: 200,
    }
  );
}