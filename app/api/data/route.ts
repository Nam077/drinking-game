import { NextResponse } from "next/server";
import cardsData from "@/app/data/card.json";

export async function GET() {
  try {
    return NextResponse.json(cardsData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 