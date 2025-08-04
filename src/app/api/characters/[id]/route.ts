import { NextRequest, NextResponse } from 'next/server';

const GIANTBOMB_API_KEY = process.env.NEXT_PUBLIC_GIANTBOMB_API_KEY;
const GIANTBOMB_API_URL = process.env.NEXT_PUBLIC_GIANTBOMB_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const characterId =await params.id;

  if (!characterId) {
    return NextResponse.json({ error: 'Character ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${GIANTBOMB_API_URL}/character/${characterId}/?api_key=${GIANTBOMB_API_KEY}&format=json`,
      {
        headers: {
          'User-Agent': 'GameHub/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error === "OK" && data.results) {
      return NextResponse.json({ character: data.results });
    } else {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching character details:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json({ 
          error: 'Network error: Unable to connect to GiantBomb API' 
        }, { status: 503 });
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Request timeout: GiantBomb API is taking too long to respond' 
        }, { status: 408 });
      }
      if (error.message.includes('404')) {
        return NextResponse.json({ 
          error: 'Character not found in GiantBomb database' 
        }, { status: 404 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch character details from GiantBomb' 
    }, { status: 500 });
  }
}