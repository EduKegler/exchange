"use client";

import { memo } from "react";
import { useMarket } from "../context/MarketContext";
import { Layout, Typography, Space, Flex } from "antd";

interface HeaderProps {
  price: string;
}

const Header = ({ price }: HeaderProps) => {
  const { selectedPair } = useMarket();
  return (
    <Layout.Header>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4}>GTE Exchange</Typography.Title>
        <Space>
          <Typography.Text>{selectedPair}:</Typography.Text>
          <Typography.Text>${parseFloat(price).toFixed(2)}</Typography.Text>
        </Space>
      </Flex>
    </Layout.Header>
  );
};

export default memo(Header);
