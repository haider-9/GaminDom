// Import all models to ensure they are registered
import User from './User.js';
import Game from './Game.js';
import Review from './Review.js';

// Export all models
export { User, Game, Review };

// Ensure all models are registered
export default {
  User,
  Game,
  Review
};