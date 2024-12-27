import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const YAHOO_API_KEY = process.env.NEXT_PUBLIC_YAHOO_FINANCE_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const options = YAHOO_API_KEY ? {
    headers: {
      'x-api-key': YAHOO_API_KEY
    }
  } : {};

  try {
    const results = await yahooFinance.search(query, {
      ...options,
      newsCount: 0,
      quotesCount: 20
    });

    const stocks = results.quotes
      .filter(quote => 'typeDisp' in quote && quote.typeDisp === 'Equity')
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname,
        exchange: quote.exchange
      }));

    return NextResponse.json({ results: stocks });
  } catch (error) {
    console.error('Stock search failed:', error);
    return NextResponse.json({ 
      error: 'Failed to search stocks',
      results: [] 
    }, { status: 500 });
  }
}
