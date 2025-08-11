import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gameId: { type: String, required: true }, // RAWG game ID
  gameTitle: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  aliases: [{ type: String }],
  gender: { type: String, default: '' },
  origin: { type: String, default: '' },
  // External API references
  giantBombId: { type: String, default: '' },
  rawgId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Create compound index for game and character lookup
CharacterSchema.index({ gameId: 1, name: 1 });

export default mongoose.models.Character || mongoose.model('Character', CharacterSchema);