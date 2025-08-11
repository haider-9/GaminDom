import { NextRequest, NextResponse } from 'next/server';

const GAMESPOT_API_KEY = process.env.GAMESPOT_API_KEY;
const GAMESPOT_API_URL = process.env.GAMESPOT_API_URL || 'http://www.gamespot.com/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log('GameSpot API Key exists:', !!GAMESPOT_API_KEY);
    console.log('GameSpot API URL:', GAMESPOT_API_URL);

    if (!GAMESPOT_API_KEY) {
        return NextResponse.json(
            { error: 'GameSpot API key not configured' },
            { status: 500 }
        );
    }

    const resolvedParams = await params;
    const articleId = resolvedParams.id;
    console.log('Fetching article with ID:', articleId);

    try {
        // Build GameSpot API URL for single article
        const apiParams = new URLSearchParams({
            api_key: GAMESPOT_API_KEY,
            format: 'json',
        });

        // Try the direct article endpoint first
        let gamespotUrl = `${GAMESPOT_API_URL}/articles/${articleId}/?${apiParams.toString()}`;

        console.log('Fetching article from:', gamespotUrl);

        let response = await fetch(gamespotUrl, {
            headers: {
                'User-Agent': 'GaminDom/1.0',
            },
        });

        console.log('GameSpot API response status:', response.status);

        // If direct endpoint fails, try with filter
        if (!response.ok) {
            console.log('Direct endpoint failed, trying with filter...');
            gamespotUrl = `${GAMESPOT_API_URL}/articles/?${apiParams.toString()}&filter=id:${articleId}`;

            response = await fetch(gamespotUrl, {
                headers: {
                    'User-Agent': 'GaminDom/1.0',
                },
            });

            console.log('Filter endpoint response status:', response.status);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GameSpot API error response:', errorText);
            throw new Error(`GameSpot API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('GameSpot API response structure:', {
            hasResults: !!data.results,
            resultsType: Array.isArray(data.results) ? 'array' : typeof data.results,
            resultsLength: Array.isArray(data.results) ? data.results.length : 'N/A'
        });

        if (!data.results) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }

        // Handle both single result and array results
        const article = Array.isArray(data.results) ? data.results[0] : data.results;

        if (!article) {
            return NextResponse.json(
                { error: 'Article not found' },
                { status: 404 }
            );
        }
        console.log('Article data keys:', Object.keys(article));
        console.log('Authors type:', typeof article.authors, 'Value:', article.authors);

        // Handle authors - can be string or array
        let authors = [];
        if (typeof article.authors === 'string') {
            // If authors is a string, create a simple author object
            authors = [{ id: 1, name: article.authors, api_detail_url: '', site_detail_url: '' }];
        } else if (Array.isArray(article.authors)) {
            authors = article.authors;
        }

        // Handle categories - ensure it's an array
        let categories = [];
        if (Array.isArray(article.categories)) {
            categories = article.categories;
        }

        // Handle associations - ensure it's an array
        let associations = [];
        if (Array.isArray(article.associations)) {
            associations = article.associations;
        }

        const transformedData = {
            id: article.id || articleId,
            title: article.title || 'Untitled Article',
            deck: article.deck || '',
            lede: article.lede || '',
            body: article.body || article.description || 'Article content not available.',
            image: {
                original: article.image?.original || article.image?.super_url,
                super_url: article.image?.super_url,
                screen_url: article.image?.screen_url,
                medium_url: article.image?.medium_url,
                small_url: article.image?.small_url,
                thumb_url: article.image?.thumb_url,
            },
            authors: authors,
            categories: categories,
            associations: associations,
            publish_date: article.publish_date || article.date_created,
            update_date: article.update_date || article.date_last_updated,
            site_detail_url: article.site_detail_url || '',
            videos_api_url: article.videos_api_url || '',
            status: 'ok'
        };

        console.log('Transformed data:', transformedData);

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('GameSpot API error:', error);

        // Return mock data for testing if API fails
        const mockData = {
            id: articleId,
            title: 'Sample Gaming News Article',
            deck: 'This is a sample article deck/summary for testing purposes.',
            lede: 'This is the lead paragraph of the article that provides an introduction to the main content.',
            body: `
        <p>This is a sample article body for testing the news detail page functionality.</p>
        <p>The article would normally contain the full content from GameSpot, including rich HTML formatting, images, and other media elements.</p>
        <h2>Sample Heading</h2>
        <p>More content would go here with proper formatting and structure.</p>
        <p>This mock data allows us to test the frontend while debugging the GameSpot API integration.</p>
      `,
            image: {
                original: '/placeholder-news.svg',
                super_url: '/placeholder-news.svg',
                screen_url: '/placeholder-news.svg',
                medium_url: '/placeholder-news.svg',
                small_url: '/placeholder-news.svg',
                thumb_url: '/placeholder-news.svg',
            },
            authors: [
                { id: 1, name: 'GameSpot Staff', api_detail_url: '', site_detail_url: '' }
            ],
            categories: [
                { id: 1, name: 'Gaming', api_detail_url: '', site_detail_url: '' }
            ],
            associations: [
                { id: 1, name: 'PC Gaming', api_detail_url: '', site_detail_url: '' },
                { id: 2, name: 'PlayStation', api_detail_url: '', site_detail_url: '' }
            ],
            publish_date: new Date().toISOString(),
            update_date: new Date().toISOString(),
            site_detail_url: 'https://gamespot.com',
            videos_api_url: '',
            status: 'ok'
        };

        console.log('Returning mock data due to API error');
        return NextResponse.json(mockData);
    }
}