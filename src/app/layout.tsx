import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/header/page"; 
import AuthProvider from "@/app/AuthProvider"; 
import type { Metadata } from 'next';
import ReduxProvider from '@/app/state/redux/ReduxProvider';
export const metadata: Metadata = {
  title: 'Crypto Dashboard',
  description: 'Live cryptocurrency prices',
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header/>
          <ReduxProvider>
          <main>{children}</main>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}