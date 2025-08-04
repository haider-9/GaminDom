import { NextRequest, NextResponse } from 'next/server';

const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const RAWG_API_URL = process.env.NEXT_PUBLIC_RAWG_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extract query parameters
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('page_size') || '20';
  const ordering = searchParams.get('ordering') || '';
  const search = searchParams.get('search') || '';
  const genres = searchParams.get('genres') || '';
  const platforms = searchParams.get('platforms') || '';
  const tags = searchParams.get('tags') || '';
  const dates = searchParams.get('dates') || '';
  const metacritic = searchParams.get('metacritic') || '';

  try {
    // Build the URL with query parameters
    const params = new URLSearchParams({
      key: RAWG_API_KEY!,
      page,
      page_size: pageSize,
    });

    if (ordering) params.append('ordering', ordering);
    if (search) params.append('search', search);
    if (genres) params.append('genres', genres);
    if (platforms) params.append('platforms', platforms);
    if (tags) params.append('tags', tags);
    if (dates) params.append('dates', dates);
    if (metacritic) params.append('metacritic', metacritic);

    const url = `${RAWG_API_URL}?${params.toString()}`;

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
    console.error('Error fetching games list:', error);
    
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
      if (error.message.includes('429')) {
        return NextResponse.json({ 
          error: 'Too many requests: Please wait a moment before trying again' 
        }, { status: 429 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch games list' 
    }, { status: 500 });
  }
}