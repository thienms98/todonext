"use client";

import "./globals.css";
import type { Metadata } from "next";
import { store } from "@/store";
import { Provider } from "react-redux";

import Header from "./Header";
import AuthWrapper from "@/components/AuthWrapper";
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
          <AuthWrapper>
            <Header />
            {children}
            {modal}
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
