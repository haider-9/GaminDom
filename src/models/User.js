import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' }, // URL or base64 string
  bannerImage: { type: String, default: '' }, // URL or base64 string
  bio: { type: String, default: '', maxlength: 500 },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  favouriteCharacters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
