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
            <div className="bg-background-secondary rounded-xl border border-background-quaternary w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-background-quaternary">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-primary">Write a Review</h2>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-tertiary transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Game Info */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-12 h-12 bg-surface-secondary rounded-lg flex items-center justify-center overflow-hidden">
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        alt={game.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="accent-primary text-xs">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{game.name}</h3>
                    <p className="text-sm text-muted">Rate and review this game</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-secondary text-sm font-medium mb-3">
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
                              ? 'text-warning fill-current'
                              : 'text-background-quaternary'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-secondary">
                      {rating > 0 && `${rating}/5 stars`}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-secondary text-sm font-medium mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="w-full bg-surface-secondary border border-background-quaternary rounded-lg px-4 py-3 text-primary placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all resize-none"
                    placeholder="Share your thoughts about this game..."
                  />
                  <p className="text-xs text-muted mt-1">
                    {reviewText.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-surface-secondary border border-background-quaternary rounded-lg text-secondary hover:bg-surface-tertiary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 px-4 py-3 accent-bg hover:bg-primary-hover disabled:bg-primary/50 text-text-inverse font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
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