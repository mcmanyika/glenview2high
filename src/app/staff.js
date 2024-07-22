
'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "./components/Layout";
import Features from "./components/Features";

export default function Staff() {
  const session = useSession();
  return (
    <Layout>
      <Features />
      <button onClick={() => signOut()}>Logout</button>
    </Layout>
  );
}
