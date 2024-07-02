
'use client';
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Features from "./components/Features";
import EventsCalendar from "./components/EventsCalendar";
import Address from "./components/Address";
import MissionStatement from "./components/MissionStatement";
import Fountain from "./components/Fountain";
import Placeholder from "./components/Placeholder";

export default function Staff() {
  const session = useSession();
  return (
    <Layout>
      <Features />
      <button onClick={() => signOut()}>Logout</button>
    </Layout>
  );
}
