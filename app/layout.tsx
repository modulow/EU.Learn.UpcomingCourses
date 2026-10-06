import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU Learn · Upcoming Courses",
  description: "Daily view of upcoming EU learning courses.",
  openGraph: {
    title: "EU Learn · Upcoming Courses",
    description: "Fresh upcoming courses, updated every day.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
