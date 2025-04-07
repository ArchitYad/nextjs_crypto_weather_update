import { NextRequest, NextResponse } from "next/server";
import { getCityWeatherData } from "@/lib/getCittyWeatherData";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await params; // Await the params object
    const data = await getCityWeatherData(city);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in GET /api/city/[city]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}