import { useState } from 'react';
import styles from '../styles/Stocks.module.css';

export default function StockPredictor() {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState('2y');
  const [loading, setLoading] = useState(false);
  interface Prediction {
    latestPrice: number;
    predictedPrice: number;
    confidence: number;
    chart?: string;
  }

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('/api/stock-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, period })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Stock Price Predictor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="symbol">Stock Symbol</label>
          <input
            id="symbol"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="period">Time Period</label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="2y">2 Years</option>
            <option value="1y">1 Year</option>
            <option value="6mo">6 Months</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}
      
      {prediction && (
        <div className={styles.results}>
          <h2>Prediction Results</h2>
          <div className={styles.predictionCard}>
            <p>Latest Price: ${prediction.latestPrice}</p>
            <p>Predicted Price: ${prediction.predictedPrice}</p>
            <p>Confidence Score: {prediction.confidence}%</p>
          </div>
          {prediction.chart && (
            <div className={styles.chart}>
              <img src={`data:image/png;base64,${prediction.chart}`} alt="Price prediction chart" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
