export interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export const popularStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "BRK-B", name: "Berkshire Hathaway Inc.", sector: "Financial" },
  { symbol: "LLY", name: "Eli Lilly & Co.", sector: "Healthcare" },
  { symbol: "TSM", name: "Taiwan Semiconductor", sector: "Technology" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services" },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial" },
  { symbol: "XOM", name: "Exxon Mobil Corporation", sector: "Energy" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive" },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Financial Services" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive" },
  { symbol: "AVGO", name: "Broadcom Inc.", sector: "Technology" },
  { symbol: "CVX", name: "Chevron Corporation", sector: "Energy" },
  { symbol: "HD", name: "Home Depot Inc.", sector: "Consumer Cyclical" },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology" },
  { symbol: "COST", name: "Costco Wholesale", sector: "Consumer Defensive" },
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "Healthcare" },
  { symbol: "MRK", name: "Merck & Co.", sector: "Healthcare" },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology" },
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology" },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Financial" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication Services" },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer Defensive" },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology" },
  { symbol: "INTC", name: "Intel Corporation", sector: "Technology" },
  { symbol: "CMCSA", name: "Comcast Corporation", sector: "Communication Services" },
  { symbol: "TMUS", name: "T-Mobile US", sector: "Communication Services" },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Communication Services" },
  { symbol: "VZ", name: "Verizon Communications", sector: "Communication Services" },
  { symbol: "QCOM", name: "QUALCOMM Inc.", sector: "Technology" },
  { symbol: "NEE", name: "NextEra Energy", sector: "Utilities" },
  { symbol: "TXN", name: "Texas Instruments", sector: "Technology" },
  { symbol: "PM", name: "Philip Morris International", sector: "Consumer Defensive" },
  { symbol: "MS", name: "Morgan Stanley", sector: "Financial" },
  { symbol: "RTX", name: "Raytheon Technologies", sector: "Industrials" },
  { symbol: "HON", name: "Honeywell International", sector: "Industrials" },
  { symbol: "LOW", name: "Lowe's Companies", sector: "Consumer Cyclical" },
  { symbol: "IBM", name: "IBM Corp.", sector: "Technology" },
  { symbol: "AMAT", name: "Applied Materials Inc.", sector: "Technology" },
  { symbol: "GS", name: "Goldman Sachs Group", sector: "Financial" },
  { symbol: "DE", name: "Deere & Company", sector: "Industrials" },
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Industrials" },
  { symbol: "BLK", name: "BlackRock Inc.", sector: "Financial" },
  { symbol: "INTU", name: "Intuit Inc.", sector: "Technology" }
];

export const getStocksBySelector = (selector: keyof Stock) => {
  return popularStocks.reduce((acc, stock) => {
    const key = stock[selector];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(stock);
    return acc;
  }, {} as Record<string, Stock[]>);
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  return popularStocks.find(stock => stock.symbol === symbol);
};
