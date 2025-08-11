import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { User, Character } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, characterData } = await request.json();
    
    if (!userId || !characterData) {
      return NextResponse.json(
        { error: 'User ID and character data are required' },
        { status: 400 }
      );
    }

    // Find or create character
    let character = await Character.findOne({
      name: characterData.name,
      gameId: characterData.gameId
    });

    if (!character) {
      character = new Character({
        name: characterData.name,
        gameId: characterData.gameId,
        gameTitle: characterData.gameTitle,
        description: characterData.description || '',
        image: characterData.image || '',
        aliases: characterData.aliases || [],
        gender: characterData.gender || '',
        origin: characterData.origin || '',
        giantBombId: characterData.giantBombId || '',
        rawgId: characterData.rawgId || ''
      });
      await character.save();
    }

    // Add character to user's favorites
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.favouriteCharacters.includes(character._id)) {
      user.favouriteCharacters.push(character._id);
      await user.save();
    }

    return NextResponse.json({
      message: 'Character added to favorites',
      character,
      success: true
    });
  } catch (error) {
    console.error('Error adding character to favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, characterId } = await request.json();
    
    if (!userId || !characterId) {
      return NextResponse.json(
        { error: 'User ID and character ID are required' },
        { status: 400 }
      );
    }

    // Remove character from user's favorites
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.favouriteCharacters = user.favouriteCharacters.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== characterId
    );
    await user.save();

    return NextResponse.json({
      message: 'Character removed from favorites',
      success: true
    });
  } catch (error) {
    console.error('Error removing character from favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's favorite characters
    const user = await User.findById(userId).populate('favouriteCharacters');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favoriteCharacters: user.favouriteCharacters,
      success: true
    });
  } catch (error) {
    console.error('Error fetching favorite characters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}