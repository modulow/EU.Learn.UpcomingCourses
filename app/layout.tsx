import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU Learn · Upcoming Courses",
  description: "Daily view of upcoming EU learning courses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
