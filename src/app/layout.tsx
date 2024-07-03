
import { Inter } from "next/font/google";
import "./globals.css";
import Login from "./Login";
import Home from "./page";
import Staff from './staff'


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GLENVIEW 2 HIGH SCHOOL",
};

export default async function RootLayout({ 
  children 
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
