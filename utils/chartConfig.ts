import { ChartData, ChartOptions } from 'chart.js';

export const defaultChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Stock Price Prediction'
    }
  },
  scales: {
    y: {
      beginAtZero: false,
    }
  }
};
