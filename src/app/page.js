
'use client';
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from '../app/components/About';
import Socials from '../app/components/Socials';
import Vision from '../app/components/Vision';
import ImageGallery from '../app/components/ImageGallery';
import ContactUs from '../app/components/ContactUs';
import Map from '../app/components/Map';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Socials />
      <Features />
      <Vision />
      <ImageGallery />
      <Map />
      <ContactUs />
    </Layout>
  );
}
