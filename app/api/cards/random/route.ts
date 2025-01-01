import { NextResponse } from "next/server";
import cardsData from "@/app/data/card.json";
import crypto from 'crypto';

// Fisher-Yates shuffle với crypto random
function secureShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Sử dụng crypto.randomBytes để tạo số ngẫu nhiên an toàn
    const j = crypto.randomInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    const cards = cardsData.cards;
    // Shuffle toàn bộ mảng và lấy phần tử đầu tiên
    const shuffledCards = secureShuffle(cards);
    const card = {
      id: crypto.randomUUID(), // Tạo unique ID bằng crypto
      ...shuffledCards[0],
      total: cards.length
    };
    
    return NextResponse.json(card);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 