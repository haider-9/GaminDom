import express from 'express';
import User from '../models/User.js';
const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user profile (info, reviews, favourites)
import Review from '../models/Review.js';
router.get('/:id/profile', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findById(id).populate('favourites');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const reviews = await Review.find({ user: id }).populate('game', 'title');
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        favourites: user.favourites,
        createdAt: user.createdAt,
      },
      reviews,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a game to favourites
router.post('/:id/favourites', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { gameId } = req.body;
    if (!user.favourites.includes(gameId)) {
      user.favourites.push(gameId);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove a game from favourites
router.delete('/:id/favourites/:gameId', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.favourites = user.favourites.filter(
      fav => fav.toString() !== req.params.gameId
    );
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID is required' });
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
