import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://suitmedia-backend.suitdev.com/api/ideas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const apiParams = new URLSearchParams();
    
    apiParams.set('page[number]', searchParams.get('page') || '1');
    apiParams.set('page[size]', searchParams.get('per_page') || '10');
    
    // Try different append parameter formats
    apiParams.append('append[]', 'small_image');
    apiParams.append('append[]', 'medium_image');
    
    const sortParam = searchParams.get('sort') === 'newest' ? '-published_at' : 'published_at';
    apiParams.set('sort', sortParam);

    const response = await fetch(`${API_BASE_URL}?${apiParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}