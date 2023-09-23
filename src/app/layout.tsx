"use client";

import "./globals.css";
import type { Metadata } from "next";
import { store } from "@/store";
import { Provider } from "react-redux";

import Header from "./Header";
import AuthWrapper from "@/components/AuthWrapper";
import { Inter } from "next/font/google";
import { ConfigProvider, notification } from "antd";

notification.config({
  duration: 2,
  maxCount: 2,
});

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Todo",
  description: "My Todo with Nextjs",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <AuthWrapper>
            <ConfigProvider>
              <Header />
              {children}
              {modal}
            </ConfigProvider>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
