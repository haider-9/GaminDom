import { NextRequest, NextResponse } from 'next/server';

const GIANTBOMB_API_KEY = process.env.NEXT_PUBLIC_GIANTBOMB_API_KEY;
const GIANTBOMB_API_URL = process.env.NEXT_PUBLIC_GIANTBOMB_API_URL;

type CharacterSummary = {
  id: number;
  name: string;
  api_detail_url: string;
  site_detail_url: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get('gameSlug');

  if (!gameSlug) {
    return NextResponse.json({ error: 'Game slug is required' }, { status: 400 });
  }

  try {
    // Convert slug to readable name
    const gameName = gameSlug.replace(/-/g, ' ');

    // Search for the game on GiantBomb
    const searchResponse = await fetch(
      `${GIANTBOMB_API_URL}/search/?api_key=${GIANTBOMB_API_KEY}&format=json&query=${encodeURIComponent(gameName)}&resources=game&limit=1`,
      {
        headers: {
          'User-Agent': 'GameHub/1.0',
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ characters: [] });
    }

    const game = searchData.results[0];

    // Get characters for the game
    const charactersResponse = await fetch(
      `${GIANTBOMB_API_URL}/game/${game.id}/?api_key=${GIANTBOMB_API_KEY}&format=json&field_list=characters`,
      {
        headers: {
          'User-Agent': 'GameHub/1.0',
        },
      }
    );

    if (!charactersResponse.ok) {
      throw new Error(`HTTP error! status: ${charactersResponse.status}`);
    }

    const charactersData = await charactersResponse.json();

    if (!charactersData.results?.characters) {
      return NextResponse.json({ characters: [] });
    }

    // Fetch detailed character information (limit to 12 for better pagination)
    const characterDetails = await Promise.all(
      charactersData.results.characters.map(async (char: CharacterSummary) => {
        try {
          const detailResponse = await fetch(
            `${GIANTBOMB_API_URL}/character/${char.id}/?api_key=${GIANTBOMB_API_KEY}&format=json`,
            {
              headers: {
                'User-Agent': 'GameHub/1.0',
              },
            }
          );

          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (detailData.error === "OK" && detailData.results) {
              return {
                id: detailData.results.id,
                name: detailData.results.name,
                image: detailData.results.image?.medium_url || detailData.results.image?.small_url || null,
                description: detailData.results.description || detailData.results.deck || null
              };
            }
          }
        } catch (error) {
          console.error(`Failed to fetch character ${char.id}:`, error);
        }
        return null;
      })
    );

    const validCharacters = characterDetails.filter(Boolean);

    return NextResponse.json({ characters: validCharacters });
  } catch (error) {
    console.error('Error fetching characters:', error);

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
    }

    return NextResponse.json({
      error: 'Failed to fetch characters from GiantBomb'
    }, { status: 500 });
  }
}