import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import AuthProvider from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const AeonikTRIAL = localFont({
  src: [
    { path: "/fonts/AeonikTRIAL-Regular.otf", weight: "400", style: "normal" },
    { path: "/fonts/AeonikTRIAL-Light.otf", weight: "600", style: "normal" },
    { path: "/fonts/AeonikTRIAL-Bold.otf", weight: "700", style: "normal" },
  ],
});
const AntipastoPro = localFont({
  src: [
    {
      path: "./fonts/AntipastoPro-Light_trial.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "/fonts/AntipastoPro-Light_trial.ttf",
      weight: "200",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Vaani",
  description:
    " A Voice-First Conversational AI Assistant that feels natural, informative and customizable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${AeonikTRIAL.className} ${geistSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
