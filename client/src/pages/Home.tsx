import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import FindTrips from "@/components/FindTrips";
import SendPackage from "@/components/SendPackage";
import FeaturedItems from "@/components/FeaturedItems";
import Safety from "@/components/Safety";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>BlaBlaShip - Connect Travelers with Package Senders</title>
        <meta name="description" content="A trusted community marketplace for Tunisians abroad to send and receive packages through travelers heading to Tunisia." />
        <meta property="og:title" content="BlaBlaShip - Connect Travelers with Package Senders" />
        <meta property="og:description" content="A trusted community marketplace for Tunisians abroad to send and receive packages through travelers heading to Tunisia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blablaship.com" />
      </Helmet>
      <div className="min-h-screen">
        <Hero />
        <Stats />
        <HowItWorks />
        <FindTrips />
        <SendPackage />
        <FeaturedItems />
        <Safety />
        <Testimonials />
        <CallToAction />
      </div>
    </>
  );
}
