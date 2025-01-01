import { NextResponse } from "next/server";
import { initializeDatabase } from "@/app/lib/database";
import { Card } from "@/app/entities/Card";
import cardsData from "@/app/data/card.json";

export async function GET() {
  try {
    const dataSource = await initializeDatabase();
    const cards = await dataSource.getRepository(Card).find({
      where: { isArchived: false },
      order: { createdAt: "DESC" }
    });
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dataSource = await initializeDatabase();
    const cardRepository = dataSource.getRepository(Card);
    
    const card = cardRepository.create({
      content: body.content,
      explanation: body.explanation
    });
    
    await cardRepository.save(card);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Thêm endpoint để import dữ liệu từ JSON
export async function PUT() {
  try {
    const dataSource = await initializeDatabase();
    const cardRepository = dataSource.getRepository(Card);
    
    // Import dữ liệu từ file JSON
    const cards = await Promise.all(
      cardsData.cards.map(async (cardData) => {
        const card = cardRepository.create({
          content: cardData.content,
          explanation: cardData.explanation
        });
        return await cardRepository.save(card);
      })
    );
    
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Error importing cards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 