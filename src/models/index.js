// Import all models to ensure they are registered
import User from './User.js';
import Game from './Game.js';
import Review from './Review.js';
import Character from './Character.js';

// Export all models
export { User, Game, Review, Character };

// Create models object and export as default
const models = {
  User,
  Game,
  Review,
  Character
};

export default models;