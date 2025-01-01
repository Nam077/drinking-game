'use client'

import { useState, useEffect, useCallback } from 'react';
import FlipCard from './FlipCard';
import LoadingCard from './LoadingCard';

interface Card {
  id: number;
  content: string;
  explanation: string;
}

export default function CardManager() {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewedCards] = useState<Set<number>>(new Set());

  const fetchRandomCard = useCallback(async (retryCount = 0): Promise<Card | null> => {
    try {
      if (retryCount > 5) {
        viewedCards.clear();
        return fetchRandomCard();
      }

      const response = await fetch('/api/cards/random');
      const card = await response.json();
      
      if (card && !card.error) {
        if (viewedCards.has(card.id)) {
          return fetchRandomCard(retryCount + 1);
        }
        
        viewedCards.add(card.id);
        if (viewedCards.size === card.total) {
          viewedCards.clear();
        }
        return card;
      }
      return null;
    } catch (error) {
      console.error('Error fetching card:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchRandomCard().then(card => {
      setCurrentCard(card);
      setLoading(false);
    });
  }, [fetchRandomCard]);

  const handleSwipe = async () => {
    const newCard = await fetchRandomCard();
    if (newCard) {
      setCurrentCard(newCard);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <LoadingCard />
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-lg font-medium text-gray-600">
          No cards available
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
      <FlipCard onSwipe={handleSwipe}>
        <div className="text-center">
          <div className="text-xl font-semibold text-purple-900 leading-relaxed">
            {currentCard.content}
          </div>
          <div className="mt-6 text-base text-purple-700 leading-relaxed tracking-wide">
            {currentCard.explanation}
          </div>
        </div>
      </FlipCard>
    </div>
  );
} 