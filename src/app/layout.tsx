import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./SessionProvider";
import Login from "../pages/login";
import Home from "./page";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GLENVIEW 2 HIGH SCHOOL",
};

export default async function RootLayout({ 
  children, 
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
            {/* {!session ? (
                <Login />
            ):(
                <Home/>
            )
        } */}
        </SessionProvider>
      </body>
    </html>
  );
}
