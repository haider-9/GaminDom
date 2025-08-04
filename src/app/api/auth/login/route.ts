import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual authentication logic
    // For now, we'll simulate a successful login
    if (email === 'demo@gamindom.com' && password === 'demo123') {
      const user = {
        id: '1',
        username: 'DemoUser',
        email: email,
        avatar: null,
        joinedDate: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        user,
        message: 'Login successful'
      });
    }

    // Simulate checking credentials
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}