import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Menu Studio", description: "A dynamic restaurant menu" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
