import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth"; // Import Session type
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import SessionProvider from "./SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GLENVIEW 2 HIGH SCHOOL",
};

export default async function RootLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) as Session | null; // Assert the type
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}


