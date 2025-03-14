import { Suspense } from "react";
import {
  fetchOrderBook,
  fetchRecentTrades,
  fetchSymbolPrice,
} from "../services/api";
import Header from "../components/Header";
import ClientPage from "./ClientPage";
import { ConfigProvider, Flex } from "antd";

type SearchParams = {
  symbol?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const symbol = (await searchParams).symbol || "BTCUSDC";
  const priceTicker = await fetchSymbolPrice(symbol);

  return {
    title: `${symbol} - ${parseFloat(priceTicker.price).toFixed(2)}`,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const symbol = (await searchParams).symbol || "BTCUSDC";

  const [orderBook, recentTrades, priceTicker] = await Promise.all([
    fetchOrderBook(symbol),
    fetchRecentTrades(symbol),
    fetchSymbolPrice(symbol),
  ]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "#fff",
          colorTextTertiary: "#848e9c",
          colorPrimary: "#fff",
          colorBgBase: "#181a1f",
        },
        components: {
          Layout: {
            headerBg: "#181a1f",
          },
          Card: {
            colorBgContainer: "#181a1f",
          },
          Divider: {
            colorSplit: "#2b3139",
          },
          Radio: {
            algorithm: true,
            colorText: "#848e9c",
            colorBorder: "#848e9c",
            buttonSolidCheckedActiveBg: "#0c0e12",
            buttonSolidCheckedBg: "#0c0e12",
            buttonSolidCheckedHoverBg: "#0c0e12",
            colorBorderBg: "#0c0e12",
          },
        },
      }}
    >
      <Flex vertical gap="middle" component="main">
        <Header price={priceTicker.price} />
        <Suspense fallback={<div>Loading...</div>}>
          <ClientPage
            initialSymbol={symbol}
            initialOrderBook={orderBook}
            initialTrades={recentTrades}
          />
        </Suspense>
      </Flex>
    </ConfigProvider>
  );
}
