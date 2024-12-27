import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styles from '../styles/Results.module.css';

// Dynamic import of Chart.js component
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

export default function Results() {
  const router = useRouter();
  interface Prediction {
    actual: number;
    predicted: number;
  }

  interface Predictions {
    symbol: string;
    current_price: number;
    next_day_prediction: number;
    mse: number;
    last_predictions: Prediction[];
  }

  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPredictions = () => {
      const stored = sessionStorage.getItem('stockPredictions');
      if (!stored) {
        router.replace('/');
        return;
      }

      try {
        const data = JSON.parse(stored);
        setPredictions(data);
      } catch (err) {
        setError('Failed to load predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [router]);

  if (loading) {
    return <div className={styles.container}>Loading predictions...</div>;
  }

  if (error || !predictions) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  const chartData = {
    labels: predictions.last_predictions.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Actual Prices',
        data: predictions.last_predictions.map(p => p.actual),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predicted Prices',
        data: predictions.last_predictions.map(p => p.predicted),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h1>Stock Predictions for {predictions.symbol}</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Current Price</h3>
          <p>${predictions.current_price.toFixed(2)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Next Day Prediction</h3>
          <p>${predictions.next_day_prediction.toFixed(2)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Model Accuracy (MSE)</h3>
          <p>{predictions.mse.toFixed(4)}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Price Predictions vs Actual'
            }
          }
        }} />
      </div>

      <button 
        onClick={() => router.push('/')}
        className={styles.button}
      >
        Make Another Prediction
      </button>
    </div>
  );
}
