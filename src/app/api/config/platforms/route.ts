import { NextRequest, NextResponse } from 'next/server';

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const RAWG_API_BASE_URL = 'https://api.rawg.io/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('page_size') || '20';

  try {
    const url = `${RAWG_API_BASE_URL}/platforms?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GaminDom/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json({ 
          error: 'Network error: Unable to connect to game database' 
        }, { status: 503 });
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Request timeout: Game database is taking too long to respond' 
        }, { status: 408 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch platforms' 
    }, { status: 500 });
  }
}