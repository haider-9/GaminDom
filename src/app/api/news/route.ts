import { NextRequest, NextResponse } from 'next/server';

const GAMESPOT_API_KEY = process.env.GAMESPOT_API_KEY;
const GAMESPOT_API_URL = process.env.GAMESPOT_API_URL || 'http://www.gamespot.com/api';

interface GameSpotArticle {
  id: string;
  title: string;
  deck?: string;
  body?: string;
  site_detail_url: string;
  image?: {
    original?: string;
    super_url?: string;
  };
  publish_date: string;
  authors?: Array<{
    name: string;
  }>;
  associations?: unknown[];
}

export async function GET(request: NextRequest) {
  if (!GAMESPOT_API_KEY) {
    return NextResponse.json(
      { error: 'GameSpot API key not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '12';
  const sort = searchParams.get('sort') || 'publish_date:desc';
  const filter = searchParams.get('filter');

  try {
    // Build GameSpot API URL
    const params = new URLSearchParams({
      api_key: GAMESPOT_API_KEY,
      format: 'json',
      limit,
      offset: String((parseInt(page) - 1) * parseInt(limit)),
      sort,
    });

    if (filter) {
      params.append('filter', filter);
    }

    const gamespotUrl = `${GAMESPOT_API_URL}/articles/?${params.toString()}`;

    const response = await fetch(gamespotUrl, {
      headers: {
        'User-Agent': 'GaminDom/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`GameSpot API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform GameSpot response to match expected format
    const transformedData = {
      articles: data.results?.map((article: GameSpotArticle) => {
        const bodyText = typeof article.body === 'string' ? article.body : '';
        const description = article.deck || (bodyText ? bodyText.substring(0, 200) + '...' : '');

        return {
          id: article.id,
          title: article.title,
          description,
          url: article.site_detail_url,
          urlToImage: article.image?.original || article.image?.super_url || '/placeholder-news.svg',
          publishedAt: article.publish_date,
          source: {
            name: 'GameSpot'
          },
          author: article.authors?.[0]?.name || 'GameSpot Staff',
          associations: article.associations || []
        };
      }) || [],
      totalResults: data.number_of_total_results || 0,
      status: 'ok'
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('GameSpot API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news from GameSpot' },
      { status: 500 }
    );
  }
}