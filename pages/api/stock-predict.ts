import { NextApiRequest, NextApiResponse } from 'next';
import { PythonShell } from 'python-shell';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { symbol, period } = req.body;

  if (!symbol) {
    return res.status(400).json({ message: 'Stock symbol is required' });
  }

  try {
    const options = {
      mode: 'json' as const,
      pythonPath: 'python',
      scriptPath: './ml',
      args: [
        '--symbol', symbol,
        '--period', period || '2y'
      ]
    };

    const results = await new Promise((resolve, reject) => {
      PythonShell.run('main-agent.py', options, (err, results) => {
        if (err) reject(err);
        resolve(results?.[0] || null);
      });
    });

    res.status(200).json(results || { error: 'No prediction data available' });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Failed to generate prediction' });
  }
}
