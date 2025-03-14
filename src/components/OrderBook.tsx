import { memo, useMemo } from "react";
import { OrderBookEntry } from "../services/api";
import { Card, Typography, List, Divider } from "antd";
import OrderBookItem from "./OrderBookItem";

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

const OrderBook = ({ bids, asks }: OrderBookProps) => {
  const formattedBids = useMemo(() => {
    return bids.map((bid) => ({
      price: parseFloat(bid.price),
      quantity: parseFloat(bid.quantity),
      total: parseFloat(bid.price) * parseFloat(bid.quantity),
    }));
  }, [bids]);

  const formattedAsks = useMemo(() => {
    return asks.map((ask) => ({
      price: parseFloat(ask.price),
      quantity: parseFloat(ask.quantity),
      total: parseFloat(ask.price) * parseFloat(ask.quantity),
    }));
  }, [asks]);

  const maxTotal = useMemo(() => {
    const maxBidTotal = Math.max(...formattedBids.map((bid) => bid.total), 0);
    const maxAskTotal = Math.max(...formattedAsks.map((ask) => ask.total), 0);
    return Math.max(maxBidTotal, maxAskTotal);
  }, [formattedBids, formattedAsks]);

  return (
    <Card variant="borderless">
      <Typography.Title level={5}>Order Book</Typography.Title>
      <Divider />
      <List
        header={
          <div style={{ display: "flex" }}>
            <Typography.Text style={{ flex: 1 }} type="secondary">
              Price
            </Typography.Text>
            <Typography.Text style={{ flex: 1 }} type="secondary">
              Amount
            </Typography.Text>
            <Typography.Text style={{ flex: 1 }} type="secondary">
              Total
            </Typography.Text>
          </div>
        }
        dataSource={formattedAsks.slice().reverse()}
        size="small"
        renderItem={(ask) => (
          <OrderBookItem
            price={ask.price}
            quantity={ask.quantity}
            total={ask.total}
            maxTotal={maxTotal}
            type="ask"
          />
        )}
      />
      <Divider />
      <List
        dataSource={formattedBids}
        size="small"
        renderItem={(bid) => (
          <OrderBookItem
            price={bid.price}
            quantity={bid.quantity}
            total={bid.total}
            maxTotal={maxTotal}
            type="bid"
          />
        )}
      />
    </Card>
  );
};

export default memo(OrderBook);
