"use client";

import { useEffect, useState, memo, useCallback } from "react";
import { TradingPair, useMarket } from "../context/MarketContext";
import { useWebSocket } from "../services/websocket";
import { OrderBook as OrderBookType, Trade } from "../services/api";
import OrderBook from "../components/OrderBook";
import TradesFeed from "../components/TradesFeed";
import { useRouter } from "next/navigation";
import { Card, Radio, RadioChangeEvent, Flex, Typography, Divider } from "antd";

interface ClientPageProps {
  initialSymbol: string;
  initialOrderBook: OrderBookType;
  initialTrades: Trade[];
}

const ClientPage = ({
  initialSymbol,
  initialOrderBook,
  initialTrades,
}: ClientPageProps) => {
  const { selectedPair, setSelectedPair } = useMarket();
  const { orderBookData, tradeData } = useWebSocket(selectedPair);

  const [orderBook, setOrderBook] = useState<OrderBookType>(initialOrderBook);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const router = useRouter();

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.get("symbol") !== selectedPair) {
      router.replace(`?symbol=${selectedPair}`, { scroll: false });
    }
  }, [selectedPair, router]);

  useEffect(() => {
    if (
      initialSymbol &&
      ["BTCUSDC", "ETHUSDC", "SOLUSDC"].includes(initialSymbol)
    ) {
      setSelectedPair(initialSymbol as TradingPair);
    }
  }, [initialSymbol, setSelectedPair]);

  useEffect(() => {
    if (orderBookData) {
      setOrderBook(() => ({
        lastUpdateId: orderBookData.lastUpdateId,
        bids: orderBookData.bids.map(([price, quantity]) => ({
          price,
          quantity,
        })),
        asks: orderBookData.asks.map(([price, quantity]) => ({
          price,
          quantity,
        })),
      }));
    }
  }, [orderBookData]);

  useEffect(() => {
    if (tradeData.length > 0) {
      const newTrades = tradeData.map((trade) => ({
        id: trade.t,
        price: trade.p,
        qty: trade.q,
        time: trade.T,
        isBuyerMaker: trade.m,
      }));
      setTrades((prev) => [...newTrades, ...prev].slice(0, 50));
    }
  }, [tradeData]);

  const handlePairChange = useCallback(
    (e: RadioChangeEvent) => {
      setSelectedPair(e.target.value as TradingPair);
    },
    [setSelectedPair]
  );

  return (
    <Flex gap="middle" vertical={false}>
      <Flex style={{ flex: 1 }} vertical>
        <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
      </Flex>
      <Flex style={{ flex: 1 }} vertical gap="middle">
        <Card variant="borderless">
          <Typography.Title level={5}>Select Trading Pair</Typography.Title>
          <Divider />
          <Radio.Group
            buttonStyle="solid"
            value={selectedPair}
            onChange={handlePairChange}
            block
          >
            <Radio.Button value="BTCUSDC">BTC/USDC</Radio.Button>
            <Radio.Button value="ETHUSDC">ETH/USDC</Radio.Button>
            <Radio.Button value="SOLUSDC">SOL/USDC</Radio.Button>
          </Radio.Group>
        </Card>
        <TradesFeed trades={trades} />
      </Flex>
    </Flex>
  );
};

export default memo(ClientPage);
