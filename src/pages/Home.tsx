import Hero from '../components/Hero';
import Stats from '../components/Stats';
import BeforeAfter from '../components/BeforeAfter';
import StackingServices from '../components/StackingServices';
import Testimonials from '../components/Testimonials';
import FaqSection from '../components/FaqSection';
import CtaBanner from '../components/CtaBanner';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <BeforeAfter />
      <StackingServices />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
