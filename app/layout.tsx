import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "방방 - 부동산 직거래 플랫폼",
    template: "%s | 방방",
  },
  description: "공인중개사 없이 전·월세를 직접 거래하세요. 중개수수료 0원, 집주인과 직접 연결되는 부동산 직거래 플랫폼 방방",
  keywords: ["부동산 직거래", "전세 직거래", "월세 직거래", "중개수수료 없음", "방방", "bangbang"],
  openGraph: {
    title: "방방 - 부동산 직거래 플랫폼",
    description: "공인중개사 없이 전·월세를 직접 거래하세요. 중개수수료 0원!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
