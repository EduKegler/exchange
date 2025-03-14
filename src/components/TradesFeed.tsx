import { memo, useMemo } from "react";
import { Trade } from "../services/api";
import { Card, Divider, Flex, List, Typography } from "antd";

interface TradesFeedProps {
  trades: Trade[];
}

const TradesFeed = ({ trades }: TradesFeedProps) => {
  const formattedTrades = useMemo(() => {
    const uniqueTrades = trades.filter(
      (trade, index) => trades.findIndex((t) => t.id === trade.id) === index
    );

    return uniqueTrades.map((trade) => {
      return {
        id: trade.id,
        price: parseFloat(trade.price),
        quantity: parseFloat(trade.qty),
        total: parseFloat(trade.price) * parseFloat(trade.qty),
        time: trade.time,
        isBuyerMaker: trade.isBuyerMaker,
      };
    });
  }, [trades]);

  return (
    <Card variant="borderless">
      <Typography.Title level={5}>Recent Trades</Typography.Title>
      <Divider />
      <List
        size="small"
        header={
          <Flex>
            <Typography.Text type="secondary" style={{ flex: 1 }}>
              Price
            </Typography.Text>
            <Typography.Text type="secondary" style={{ flex: 1 }}>
              Amount
            </Typography.Text>
            <Typography.Text type="secondary" style={{ flex: 1 }}>
              Total
            </Typography.Text>
            <Typography.Text type="secondary" style={{ flex: 1 }}>
              Time
            </Typography.Text>
          </Flex>
        }
        dataSource={formattedTrades}
        renderItem={(trade) => (
          <List.Item key={trade.id}>
            <Typography.Text
              style={{
                flex: 1,
                color: trade.isBuyerMaker ? "#ff4d4f" : "#52c41a",
              }}
            >
              {trade.price.toFixed(2)}
            </Typography.Text>
            <Typography.Text style={{ flex: 1, color: "#fff" }}>
              {trade.quantity.toFixed(6)}
            </Typography.Text>
            <Typography.Text style={{ flex: 1 }}>
              {trade.total.toFixed(2)}
            </Typography.Text>
            <Typography.Text style={{ flex: 1 }}>
              {new Date(trade.time).toLocaleTimeString()}
            </Typography.Text>
          </List.Item>
        )}
        style={{ maxHeight: 500, overflow: "auto" }}
      />
    </Card>
  );
};

export default memo(TradesFeed);
