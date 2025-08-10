import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Game from '@/models/Game.js';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const gameData = await request.json();

    // Check if game already exists by rawgId
    let game = await Game.findOne({ rawgId: gameData.rawgId });

    if (game) {
      // Game exists, return it
      return NextResponse.json({
        message: 'Game found',
        game
      });
    }

    // Create new game
    game = new Game(gameData);
    await game.save();

    return NextResponse.json({
      message: 'Game created successfully',
      game
    });
  } catch (error: unknown) {
    console.error('Game creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const rawgId = searchParams.get('rawgId');
    const gameId = searchParams.get('gameId');
    const action = searchParams.get('action');

    // Handle different actions
    if (action === 'details' && gameId) {
      // Fetch game details from RAWG API
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch game details' },
          { status: 404 }
        );
      }

      const gameData = await response.json();
      return NextResponse.json({ game: gameData });
    }

    if (action === 'screenshots' && gameId) {
      // Fetch screenshots from RAWG API
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      const response = await fetch(
        `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch screenshots' },
          { status: 404 }
        );
      }

      const screenshotsData = await response.json();
      return NextResponse.json({ screenshots: screenshotsData.results });
    }



    if (rawgId) {
      const game = await Game.findOne({ rawgId: parseInt(rawgId) });
      if (!game) {
        return NextResponse.json(
          { error: 'Game not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ game });
    }

    // Return all games
    const games = await Game.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ games });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}