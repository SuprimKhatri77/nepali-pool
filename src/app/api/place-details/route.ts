import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) return NextResponse.json({ error: "Missing place_id" }, { status: 400 });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry,name,formatted_address&key=${API_KEY}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
