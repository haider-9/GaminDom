// Import all models to ensure they are registered
import User from './User.js';
import Game from './Game.js';
import Review from './Review.js';

// Export all models
export { User, Game, Review };

// Create models object and export as default
const models = {
  User,
  Game,
  Review
};

export default models;