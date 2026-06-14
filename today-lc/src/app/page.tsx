import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { Courses } from "@/components/sections/courses";
import { WhyUs } from "@/components/sections/why-us";
import { Teachers } from "@/components/sections/teachers";
import { Testimonials } from "@/components/sections/testimonials";
import { Sovrin } from "@/components/sections/sovrin";
import { Branches } from "@/components/sections/branches";
import { Enroll } from "@/components/sections/enroll";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Courses />
      <WhyUs />
      <Teachers />
      <Testimonials />
      <Sovrin />
      <Branches />
      <Enroll />
      <Contact />
      <Footer />
    </>
  );
}
