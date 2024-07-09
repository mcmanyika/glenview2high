
'use client';
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Features from "./components/Features";
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
