"use client";

import "./globals.css";
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Todo</title>
        <link rel="icon" href="/to-do-list.png" />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <AuthWrapper>
            <ConfigProvider>
              <Header />
              <div className="mt-20">
                {children}
              </div>
              {modal}
            </ConfigProvider>
          </AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
