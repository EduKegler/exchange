const BASE_URL = "https://api.binance.com/api/v3";

export interface OrderBookEntry {
  price: string;
  quantity: string;
}

export interface OrderBook {
  lastUpdateId: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface Trade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
}

export interface PriceTicker {
  symbol: string;
  price: string;
}

export const fetchOrderBook = async (symbol: string): Promise<OrderBook> => {
  const response = await fetch(`${BASE_URL}/depth?symbol=${symbol}&limit=10`);
  const data = await response.json();
  if (data.bids && data.asks && data.lastUpdateId) {
    return {
      lastUpdateId: data.lastUpdateId,
      bids: data.bids.map((bid: string[]) => ({
        price: bid[0],
        quantity: bid[1],
      })),
      asks: data.asks.map((ask: string[]) => ({
        price: ask[0],
        quantity: ask[1],
      })),
    };
  }
  console.log(data);
  throw new Error("Invalid response from Binance");
};

export const fetchRecentTrades = async (symbol: string): Promise<Trade[]> => {
  const response = await fetch(`${BASE_URL}/trades?symbol=${symbol}&limit=50`);
  return response.json();
};

export const fetchSymbolPrice = async (
  symbol: string
): Promise<PriceTicker> => {
  const response = await fetch(`${BASE_URL}/ticker/price?symbol=${symbol}`);
  return response.json();
};
