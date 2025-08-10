import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGame extends Document {
  title: string;
  description?: string;
  rawgId: number;
  image?: string;
  rating?: number;
  released?: Date;
  platforms?: string[];
  genres?: string[];
  createdAt?: Date;
}

const GameSchema: Schema<IGame> = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  rawgId: { type: Number, unique: true }, // For linking with RAWG API
  image: { type: String },
  rating: { type: Number },
  released: { type: Date },
  platforms: [{ type: String }],
  genres: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Game as Model<IGame>) ||
  mongoose.model<IGame>("Game", GameSchema);
