'use client'

import { useState, useCallback } from 'react';
import CardBack from './CardBack';
import './FlipCard.css';

interface FlipCardProps {
  children?: React.ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  isInteractive?: boolean;
}

const FlipCard = ({ children, onSwipe, isInteractive = true }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, time: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState<'left' | 'right' | null>(null);
  const [isTouchDevice] = useState('ontouchstart' in window);
  const [startPoint, setStartPoint] = useState({ x: 0, time: 0 });

  const handleExit = useCallback(async (direction: 'left' | 'right') => {
    setIsFlipped(false);
    setIsExiting(direction);
    await new Promise(resolve => setTimeout(resolve, 300));
    onSwipe?.(direction);
    setIsExiting(null);
  }, [onSwipe]);

  const handleClick = () => {
    if (!isInteractive || isExiting || isDragging || isTouchDevice) return;
    setIsFlipped(!isFlipped);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isInteractive || isExiting) return;
    const touch = e.touches[0];
    setStartPoint({ x: touch.clientX, time: Date.now() });
    setDragStart({ x: touch.clientX, time: Date.now() });
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isExiting) return;
    const touch = e.touches[0];
    const offset = touch.clientX - dragStart.x;
    const limitedOffset = Math.min(Math.max(offset, -200), 200);
    setDragOffset(limitedOffset);
  };

  const handleTouchEnd = () => {
    if (!isInteractive || isExiting) return;
    
    const touchDuration = Date.now() - startPoint.time;
    const touchDistance = Math.abs(dragOffset);
    const isTap = touchDistance < 5 && touchDuration < 200;

    if (isTap) {
      setIsFlipped(!isFlipped);
    } else if (isDragging) {
      const swipeThreshold = 50;
      const timeThreshold = 300;
      const velocity = touchDistance / touchDuration;

      if (touchDistance > swipeThreshold || (velocity > 0.3 && touchDuration < timeThreshold)) {
        handleExit(dragOffset > 0 ? 'right' : 'left');
      }
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractive || isExiting) return;
    setDragStart({ x: e.clientX, time: Date.now() });
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isExiting) return;
    const offset = e.clientX - dragStart.x;
    const limitedOffset = Math.min(Math.max(offset, -200), 200);
    setDragOffset(limitedOffset);
  };

  const handleMouseUp = () => {
    if (!isDragging || isExiting) return;
    
    const mouseDuration = Date.now() - dragStart.time;

    const swipeThreshold = 50;
    const timeThreshold = 300;
    const velocity = Math.abs(dragOffset) / mouseDuration;

    if (Math.abs(dragOffset) > swipeThreshold || (velocity > 0.3 && mouseDuration < timeThreshold)) {
      handleExit(dragOffset > 0 ? 'right' : 'left');
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  const getCardStyle = () => {
    let transform = dragOffset ? `translateX(${dragOffset}px)` : '';
    let rotate = 'rotateZ(0deg)';
    let opacity = '1';
    const transition = isDragging ? 'none' : 'all 0.3s ease-out';

    if (isExiting === 'left') {
      transform = 'translateX(-200%)';
      rotate = 'rotateZ(-45deg)';
      opacity = '0';
    } else if (isExiting === 'right') {
      transform = 'translateX(200%)';
      rotate = 'rotateZ(45deg)';
      opacity = '0';
    } else if (dragOffset !== 0) {
      const rotationAngle = dragOffset * 0.1;
      rotate = `rotateZ(${rotationAngle}deg)`;
    }

    return {
      transform: `${transform} ${rotate}`,
      opacity,
      transition,
      position: isExiting ? 'absolute' as const : 'relative' as const,
      visibility: isExiting ? 'hidden' as const : 'visible' as const
    };
  };

  return (
    <div className="relative w-72 h-[28rem]">
      <div className="absolute inset-0 card-stack">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 card-stack-item"
            style={{
              transform: `translateY(${i * 2}px)`,
              zIndex: -i,
            }}
          >
            <div className="card-shadow w-full h-full rounded-xl bg-gradient-to-br from-white via-purple-50 to-pink-50">
              <CardBack />
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className={`card-container ${isExiting ? `exit-${isExiting}` : ''}`}
        style={{
          transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
          pointerEvents: isExiting ? 'none' : undefined
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="card-wrapper h-full"
          style={getCardStyle()}
        >
          <div className={`card-3d relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
            <div className="card-face card-front card-shadow">
              <CardBack />
              <div className="card-shine opacity-0" />
            </div>
            
            <div className="card-face card-back card-shadow">
              <div className="w-full h-full p-6 border border-purple-100 rounded-xl bg-gradient-to-br from-white via-purple-50 to-pink-50">
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-full">
                    <h3 className="text-xl font-semibold text-purple-900 leading-relaxed mb-2">
                      {children}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mx-auto" />
                  </div>
                  <div className="text-base text-purple-700 leading-relaxed tracking-wide">
                    {/* Nội dung giải thích */}
                  </div>
                </div>
              </div>
              <div className="card-shine opacity-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
