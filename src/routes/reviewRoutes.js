import express from 'express';
import Review from '../models/Review.js';
import Game from '../models/Game.js';
const router = express.Router();

// Add review to a game
router.post('/games/:gameId/reviews', async (req, res) => {
  try {
    const { rating, text, user } = req.body;
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    const review = new Review({ user, game: req.params.gameId, rating, text });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List reviews for a game
router.get('/games/:gameId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single review
router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'username');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a review
router.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
