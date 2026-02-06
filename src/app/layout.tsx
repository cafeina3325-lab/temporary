import "./globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import ScrollToTop from "@/components/ScrollToTop";
import MobileMenu from "@/components/MobileMenu";

export const metadata: Metadata = {
  title: "FLYING STUDIO",
  description: "FLYING STUDIO website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Bebas+Neue&family=Josefin+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Suspense fallback={null}>
          <ScrollToTop />
          <MobileMenu />
        </Suspense>
      </body>
    </html>
  );
}
