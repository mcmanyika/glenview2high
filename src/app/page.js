
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Features from "./components/Features";
import EventsCalendar from "./components/EventsCalendar";
import Address from "./components/Address";
import MissionStatement from "./components/MissionStatement";

export default function Home() {
  return (
    <Layout>
      {/* <MissionStatement /> */}
      <Features />
    </Layout>
  );
}
