import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Game } from '@/models/index.js'; // Import all models to ensure registration

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Ensure Game model is registered
    Game;
    
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // First get user without populate to avoid schema issues
    const rawUser = await User.findById(id).select('-password');
    
    if (!rawUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Manually populate favourites to avoid schema registration issues
    let populatedFavourites = [];
    if (rawUser.favourites && rawUser.favourites.length > 0) {
      try {
        populatedFavourites = await Game.find({
          '_id': { $in: rawUser.favourites }
        }).select('title description image rating rawgId released platforms genres');
      } catch (gameError) {
        console.error('Error fetching games:', gameError);
        // If game fetch fails, just return empty favourites
        populatedFavourites = [];
      }
    }
    
    // Convert _id to id for consistency
    const user = {
      id: rawUser._id,
      username: rawUser.username,
      email: rawUser.email,
      profileImage: rawUser.profileImage,
      bannerImage: rawUser.bannerImage,
      bio: rawUser.bio,
      createdAt: rawUser.createdAt,
      favourites: populatedFavourites,
    };
    
    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    const { username, bio, profileImage, bannerImage } = await request.json();
    
    // Validate bio length
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      );
    }
    
    const rawUser = await User.findByIdAndUpdate(
      id,
      { 
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(profileImage !== undefined && { profileImage }),
        ...(bannerImage !== undefined && { bannerImage })
      },
      { new: true }
    ).select('-password');
    
    if (!rawUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Convert _id to id for consistency
    const user = {
      id: rawUser._id,
      username: rawUser.username,
      email: rawUser.email,
      profileImage: rawUser.profileImage,
      bannerImage: rawUser.bannerImage,
      bio: rawUser.bio,
      createdAt: rawUser.createdAt,
    };
    
    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error: unknown) {
    // Handle MongoDB duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}