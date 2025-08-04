import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual user creation logic
    // For now, we'll simulate checking if user exists and creating account
    
    // Simulate checking if email already exists
    if (email === 'existing@gamindom.com') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Simulate account creation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = {
      id: Date.now().toString(),
      username,
      email,
      avatar: null,
      joinedDate: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}