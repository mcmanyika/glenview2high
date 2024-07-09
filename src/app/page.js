
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
import NewStudents from '../app/components/NewStudents';
import About from '../app/components/About';
import Socials from '../app/components/Socials';
import Vision from '../app/components/Vision'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Socials />
      <Features />
      <Vision />
      <NewStudents />
    </Layout>
  );
}
