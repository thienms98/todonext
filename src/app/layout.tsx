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
        <meta property="description" content="Todoapp with next" />
        <meta property="og:image" content="/preview.png"></meta>
        <meta property="og:title" content="Todo"></meta>
        <meta property="og:description" content="Todoapp with next" />
        <meta property="og:url" content="/preview.png"></meta>
        <meta property="twitter:image" content="/preview.png"></meta>
        <meta property="twitter:card" content="/preview.png"></meta>
        <meta property="twitter:title" content="Todo"></meta>
        <meta property="twitter:description" content="Todoapp with next"></meta>
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
