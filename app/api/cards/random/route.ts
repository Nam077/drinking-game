import {  NextResponse } from "next/server";
import { initializeDatabase } from "@/app/lib/database";
import { Card } from "@/app/entities/Card";

export async function GET() {
  try {
    const dataSource = await initializeDatabase();
    
    const [card, total] = await Promise.all([
      dataSource
        .getRepository(Card)
        .createQueryBuilder("card")
        .where("card.isArchived = :isArchived", { isArchived: false })
        .orderBy("RANDOM()")
        .limit(1)
        .getOne(),
      dataSource
        .getRepository(Card)
        .count({ where: { isArchived: false } })
    ]);

    if (!card) {
      return NextResponse.json(
        { error: "No cards available" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ ...card, total });
  } catch (error) {
    console.error("Error getting random card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 