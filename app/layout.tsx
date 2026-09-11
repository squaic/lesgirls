import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={ title:"Les Girlz", description:"Notre carnet privé de bons plans" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="fr"><body>{children}</body></html>; }
