import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { user, game, rating, text } = await request.json();
    
    const review = new Review({
      user,
      game,
      rating,
      text,
    });
    
    await review.save();
    
    return NextResponse.json({ 
      message: 'Review created successfully',
      review
    });
  } catch (error: unknown) {
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
    const gameId = searchParams.get('gameId');
    const userId = searchParams.get('userId');
    
    const query: Record<string, string> = {};
    if (gameId) query.game = gameId;
    if (userId) query.user = userId;
    
    const reviews = await Review.find(query)
      .populate('user', 'username profileImage')
      .populate('game', 'title image')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ reviews });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}