"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send } from 'lucide-react';
import Image from "next/image";
import { showToast } from '@/lib/toast-config';

interface Game {
  id: number;
  name: string;
  background_image?: string;
  rating?: number;
  released?: string;
  platforms?: unknown[];
  genres?: unknown[];
  description?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  game, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      showToast.error('Please select a rating');
      return;
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      showToast.error('Please log in to submit a review');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const userId = user.id || user._id;
      
      if (!userId) {
        showToast.error('Please log in again');
        return;
      }

      setIsSubmitting(true);

      // First, ensure the game exists in our database
      const gameData = {
        title: game.name,
        description: game.description || '',
        rawgId: game.id,
        image: game.background_image || '',
        rating: game.rating || 0,
        released: game.released || null,
        platforms: game.platforms?.map(p => {
          const platform = p as Record<string, unknown>;
          return (platform.platform as Record<string, unknown>)?.name || platform.name;
        }).filter(Boolean) || [],
        genres: game.genres?.map(g => {
          const genre = g as Record<string, unknown>;
          return genre.name;
        }).filter(Boolean) || [],
      };

      // Create or find the game
      const gameResponse = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });

      let gameId;
      if (gameResponse.ok) {
        const gameResult = await gameResponse.json();
        gameId = gameResult.game._id;
      } else {
        throw new Error('Failed to create/find game');
      }

      // Submit the review
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          game: gameId,
          rating,
          text: reviewText.trim(),
        }),
      });

      if (reviewResponse.ok) {
        showToast.success('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        onClose();
        onReviewSubmitted?.();
      } else {
        const error = await reviewResponse.json();
        showToast.error(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoverRating(0);
      setReviewText('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-51 flex items-center justify-center p-4"
          >
            <div className="bg-[#1a0a0a] rounded-xl border border-[#3a1a1a] w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-[#3a1a1a]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Write a Review</h2>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-8 h-8 rounded-full bg-[#2a1a1a] flex items-center justify-center text-[#d1c0c0] hover:text-white hover:bg-[#3a1a1a] transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Game Info */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-12 bg-[#2a1a1a] rounded-lg flex items-center justify-center overflow-hidden">
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-[#bb3b3b] text-xs">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{game.name}</h3>
                    <p className="text-sm text-[#8a6e6e]">Rate and review this game</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-[#e0d0d0] text-sm font-medium mb-3">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-[#3a1a1a]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-[#d1c0c0]">
                      {rating > 0 && `${rating}/5 stars`}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-[#e0d0d0] text-sm font-medium mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg px-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:ring-2 focus:ring-[#bb3b3b]/30 focus:outline-none transition-all resize-none"
                    placeholder="Share your thoughts about this game..."
                  />
                  <p className="text-xs text-[#8a6e6e] mt-1">
                    {reviewText.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg text-[#d1c0c0] hover:bg-[#3a1a1a] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 px-4 py-3 bg-[#bb3b3b] hover:bg-[#d14d4d] disabled:bg-[#8a2a2a] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;