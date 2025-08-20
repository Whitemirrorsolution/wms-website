import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import UpcomingSection from "../components/UpcomingSection";
import JobListings from "../components/JobListings";
// import CareerPage from "../components/CareerPage";
import ContactPage from "../components/ContactPage";
import FinalFooter from "../components/FinalFooter";

const Home = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <UpcomingSection />
        {/* <JobListings/> */}
        <ContactPage />
      </main>
      {/* <FinalFooter /> */}
    </div>
  );
};

export default Home;
