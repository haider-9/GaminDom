import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Game } from '@/models/index.js';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { gameData } = await request.json();
    
    // First, ensure the game exists in our database
    let game = await Game.findOne({ rawgId: gameData.rawgId });
    
    if (!game) {
      // Create the game if it doesn't exist
      game = new Game({
        title: gameData.title,
        description: gameData.description,
        rawgId: gameData.rawgId,
        image: gameData.image,
        rating: gameData.rating,
        released: gameData.released,
        platforms: gameData.platforms,
        genres: gameData.genres,
      });
      await game.save();
    }
    
    // Add to user's favorites
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favourites: game._id } }, // $addToSet prevents duplicates
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Manually get favorites to avoid populate issues
    const favorites = await Game.find({
      '_id': { $in: user.favourites }
    });
    
    return NextResponse.json({ 
      message: 'Game added to favorites',
      favorites: favorites 
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    
    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { favourites: gameId } },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Manually get favorites to avoid populate issues
    const favorites = await Game.find({
      '_id': { $in: user.favourites }
    });
    
    return NextResponse.json({ 
      message: 'Game removed from favorites',
      favorites: favorites 
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}