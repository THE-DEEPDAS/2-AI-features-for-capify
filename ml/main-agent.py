import numpy as np
import pandas as pd
import json
import argparse
import yfinance as yf
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import os
from dotenv import load_dotenv

load_dotenv()
YAHOO_API_KEY = os.getenv('YAHOO_FINANCE_API_KEY')

def get_stock_data(symbol, period):
    if YAHOO_API_KEY:
        return yf.download(
            symbol, 
            period=period, 
            headers={'User-Agent': 'Mozilla/5.0'}, 
            progress=False
        )
    else:
        return yf.download(symbol, period=period, progress=False)

def main():
    # Parse arguments
    parser = argparse.ArgumentParser(description='Stock Market Prediction using ML')
    parser.add_argument('--symbol', type=str, required=True)
    parser.add_argument('--period', type=str, default="2y")
    parser.add_argument('--window', type=int, default=5)
    args = parser.parse_args()

    try:
        # Download data
        df = get_stock_data(args.symbol, args.period)
        
        if df.empty:
            raise ValueError(f"No data available for symbol {args.symbol}")

        # Feature Engineering
        window_size = args.window
        df['SMA'] = df['Close'].rolling(window=window_size).mean()

        # Prepare data
        X = []
        y = []
        
        for i in range(window_size, len(df)):
            X.append(df['Close'].iloc[i-window_size:i].values)
            y.append(df['Close'].iloc[i])

        X = np.array(X).reshape(len(X), -1)
        y = np.array(y)

        # Split and train
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        model = LinearRegression()
        model.fit(X_train, y_train)

        # Predict
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)

        # Prepare response
        last_predictions = []
        for actual, predicted in zip(y_test[-5:], y_pred[-5:]):
            last_predictions.append({
                'actual': float(actual),
                'predicted': float(predicted)
            })

        response = {
            'symbol': args.symbol,
            'mse': float(mse),
            'last_predictions': last_predictions,
            'current_price': float(df['Close'].iloc[-1]),
            'next_day_prediction': float(y_pred[-1])
        }

        print(json.dumps(response))

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'status': 'error'
        }))
        exit(1)

if __name__ == "__main__":
    main()
