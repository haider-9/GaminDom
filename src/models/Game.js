import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  rawgId: { type: Number, unique: true },
  image: { type: String },
  rating: { type: Number },
  released: { type: Date },
  platforms: [{ type: String }],
  genres: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Game || mongoose.model('Game', GameSchema);