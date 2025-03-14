import type { Metadata } from "next";
import "./globals.css";
import { MarketProvider } from "../context/MarketContext";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "GTE Exchange",
  description: "A high-performance decentralized exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <MarketProvider>{children}</MarketProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
