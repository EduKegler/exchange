import { useEffect, useRef, useState, useCallback } from "react";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

export interface OrderBookUpdate {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface TradeUpdate {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

export const useWebSocket = (symbol: string) => {
  const [orderBookData, setOrderBookData] = useState<OrderBookUpdate | null>(
    null
  );
  const [tradeData, setTradeData] = useState<TradeUpdate[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const isOrderBookUpdate = (
    data: OrderBookUpdate | TradeUpdate
  ): data is OrderBookUpdate => {
    return "lastUpdateId" in data;
  };

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(
      `${BINANCE_WS_URL}/${symbol.toLowerCase()}@depth10@1000ms/${symbol.toLowerCase()}@trade`
    );

    ws.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data) as OrderBookUpdate | TradeUpdate;
      if (isOrderBookUpdate(data)) {
        setOrderBookData(data);
      } else {
        setTradeData((prev) => {
          const newTrades = [data, ...prev];
          const uniqueTrades = newTrades.filter(
            (trade, index) =>
              newTrades.findIndex((t) => t.t === trade.t) === index
          );
          console.log(uniqueTrades);
          return uniqueTrades.slice(0, 50);
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(connectWebSocket, 5000);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return { orderBookData, tradeData };
};
