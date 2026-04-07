import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marplacode — Productos digitales que funcionan",
  description:
    "Diseñamos y construimos productos digitales para founders y startups que quieren escalar. No somos una agencia. Somos tu partner estratégico.",
  keywords: [
    "producto digital",
    "startup",
    "diseño de producto",
    "desarrollo web",
    "UX/UI",
    "next.js",
    "partner estratégico",
  ],
  openGraph: {
    title: "Marplacode — Productos digitales que funcionan",
    description:
      "Diseñamos y construimos productos digitales para founders y startups que quieren escalar.",
    url: "https://marplacode.com",
    siteName: "Marplacode",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marplacode — Productos digitales que funcionan",
    description:
      "Diseñamos y construimos productos digitales para founders y startups que quieren escalar.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tilt+Warp&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
