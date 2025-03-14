import { memo } from "react";
import { List, Typography } from "antd";

interface OrderBookItemProps {
  price: number;
  quantity: number;
  total: number;
  maxTotal: number;
  type: "ask" | "bid";
}

const OrderBookItem = ({
  price,
  quantity,
  total,
  maxTotal,
  type,
}: OrderBookItemProps) => {
  const backgroundColor =
    type === "ask" ? "rgba(207, 19, 34, 0.3)" : "rgba(14, 203, 129, 0.3)";

  const textColor = type === "ask" ? "danger" : "success";

  return (
    <List.Item style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${(total / maxTotal) * 100}%`,
          background: backgroundColor,
          zIndex: 0,
        }}
      />
      <Typography.Text type={textColor} style={{ flex: 1, zIndex: 1 }}>
        {price.toFixed(2)}
      </Typography.Text>
      <Typography.Text style={{ flex: 1, zIndex: 1, color: "#fff" }}>
        {quantity.toFixed(6)}
      </Typography.Text>
      <Typography.Text style={{ flex: 1, zIndex: 1 }}>
        {total.toFixed(2)}
      </Typography.Text>
    </List.Item>
  );
};

export default memo(OrderBookItem);
