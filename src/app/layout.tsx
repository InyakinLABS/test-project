import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers/provider";
import { AppHeader } from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: "Valorant Tracker",
  description: "Трекинг статистики Valorant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <div className="app">
            <AppHeader />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
