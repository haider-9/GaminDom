import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    let query = {};
    
    // If search query is provided, search by username, email, or bio
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Fetch users with basic info (exclude sensitive data like passwords)
    const rawUsers = await User.find(query)
      .select('username email profileImage bannerImage bio createdAt favourites')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Convert _id to id for consistency
    const users = rawUsers.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bannerImage: user.bannerImage,
      bio: user.bio,
      createdAt: user.createdAt,
      favourites: user.favourites,
    }));

    const totalUsers = await User.countDocuments(query);

    return NextResponse.json({
      users,
      total: totalUsers,
      hasMore: skip + limit < totalUsers
    });
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}