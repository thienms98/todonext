"use client";

import "./globals.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Metadata } from "next";
import axios from "axios";
import { Provider } from "react-redux";
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
  const router = useRouter();

  useEffect(() => {
    const getFreshToken = setInterval(() => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken: localStorage.getItem("refreshToken") },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((data) => {
          console.log(data);
          if (!data.data.accessToken || !data.data.refreshToken) {
            router.push("/login");
            return;
          }
          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        });
    }, 23 * 60 * 60 * 1000);

    return () => clearInterval(getFreshToken);
  }, []);

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
