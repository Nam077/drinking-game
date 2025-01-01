import { NextResponse } from "next/server";
import { initializeDatabase } from "@/app/lib/database";
import { Card } from "@/app/entities/Card";
import cardsData from "@/app/data/card.json";

interface CardInput {
  content: string;
  explanation: string;
  isArchived: boolean;
}

const CHUNK_SIZE = 20;

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function GET() {
  try {
    const dataSource = await initializeDatabase();
    
    await dataSource.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.clear(Card);
      
      const values = cardsData.cards.map(card => ({
        content: card.content,
        explanation: card.explanation,
        isArchived: false
      })) as CardInput[];

      const chunks = chunkArray(values, CHUNK_SIZE);
      
      for (const chunk of chunks) {
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(Card)
          .values(chunk)
          .execute();
      }
    });

    return NextResponse.json({ 
      message: `Imported cards successfully in chunks of ${CHUNK_SIZE}`
    }, { status: 200 });
  } catch (error) {
    console.error("Error importing cards:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 