import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  interface SearchResult {
    symbol: string;
    name: string;
  }

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [formData, setFormData] = useState({
    symbol: "",
    period: "2y",
  });

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search-stocks?query=${query}`);
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symbol) {
      setError("Please select a stock symbol");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/stock-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      sessionStorage.setItem('stockPredictions', JSON.stringify(data));
      router.push('/results');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Analyzing Stock Data...</h1>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Stock Market Predictor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for companies..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className={styles.searchInput}
          />
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  className={styles.searchItem}
                  onClick={() => {
                    setFormData({ ...formData, symbol: result.symbol });
                    setSearchTerm(result.name);
                    setSearchResults([]);
                  }}
                >
                  <strong>{result.symbol}</strong> - {result.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <select 
          value={formData.period} 
          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          className={styles.select}
        >
          <option value="1mo">1 Month</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="2y">2 Years</option>
        </select>

        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" className={styles.button}>
          Predict Stock Trends
        </button>
      </form>
    </div>
  );
}
