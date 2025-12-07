import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CyberSecurity Interview Vault (CSIV)",
    template: "%s | CSIV",
  },
  description:
    "Minimalist cyber security interview trainer: random Q/A, filters (category, level, frequency), EN/FR, and an easy way to propose new questions.",
  metadataBase: new URL("https://csiv.lucaprc.fr"),
  openGraph: {
    title: "CyberSecurity Interview Vault (CSIV)",
    description:
      "Practice real-world cyber security interview questions with filters, bilingual content (EN/FR) and community-contributed questions.",
    url: "https://csiv.lucaprc.fr",
    siteName: "CyberSecurity Interview Vault",
    locale: "fr_FR",
    type: "website",
  },
  keywords: [
    "cybersecurity interview",
    "cyber security interview questions",
    "cybersecurity questions and answers",
    "cybersecurity preparation",
    "cybersecurity junior interview",
    "cybersecurity senior interview",
    "security engineer interview",
    "web security interview",
    "network security interview",
    "cybersecurity FR EN",
    "entretien cybersécurité",
    "questions entretien cybersécurité",
  ],
  alternates: {
    canonical: "https://csiv.lucaprc.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
