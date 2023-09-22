"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";

import Header from "./Header";
import { Inter } from "next/font/google";

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
          <Header />
          {children}
          {modal}
        </Provider>
      </body>
    </html>
  );
}
