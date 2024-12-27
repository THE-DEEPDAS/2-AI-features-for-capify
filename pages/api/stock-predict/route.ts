import { NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { symbol, period = '2y', window = 5 } = await request.json();

    if (!symbol) {
      return NextResponse.json({ 
        message: 'Stock symbol is required',
        status: 'error'
      }, { status: 400 });
    }

    const options = {
      mode: 'json' as 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: join(process.cwd(), 'ml'),
      args: [
        '--symbol', symbol,
        '--period', period,
        '--window', window.toString()
      ]
    };

    try {
      const results = await Promise.race([
        new Promise((resolve, reject) => {
          PythonShell.run('main-agent.py', options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        }),
        new Promise((_, reject) => setTimeout(() => reject('timeout'), 15000))
      ]) as any[];

      return NextResponse.json(results[0]);
    } catch (error) {
      return NextResponse.json({ 
        message: error.toString(),
        status: 'error'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      message: 'Failed to process request',
      status: 'error'
    }, { status: 500 });
  }
}
