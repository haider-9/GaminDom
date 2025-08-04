import { NextRequest, NextResponse } from 'next/server';

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const RAWG_API_URL = process.env.NEXT_PUBLIC_RAWG_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('id');
  const endpoint = searchParams.get('endpoint') || '';

  if (!gameId) {
    return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
  }

  try {
    let url = '';
    
    switch (endpoint) {
      case 'screenshots':
        url = `${RAWG_API_URL}/${gameId}/screenshots?key=${RAWG_API_KEY}`;
        break;
      case 'details':
      default:
        url = `${RAWG_API_URL}/${gameId}?key=${RAWG_API_KEY}`;
        break;
    }

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
    console.error('Error fetching game data:', error);
    
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
      if (error.message.includes('404')) {
        return NextResponse.json({ 
          error: 'Game not found' 
        }, { status: 404 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch game data' 
    }, { status: 500 });
  }
}