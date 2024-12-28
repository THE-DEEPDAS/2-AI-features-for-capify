import { NextApiRequest, NextApiResponse } from 'next';
import yahooFinance from 'yahoo-finance2';

const YAHOO_API_KEY = process.env.NEXT_PUBLIC_YAHOO_FINANCE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.length < 2) {
    return res.status(200).json({ results: [] });
  }

  try {
    const results = await yahooFinance.search(query, {
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

    res.status(200).json({ results: stocks });
  } catch (error) {
    console.error('Stock search failed:', error);
    res.status(500).json({ 
      error: 'Failed to search stocks',
      results: [] 
    });
  }
}
