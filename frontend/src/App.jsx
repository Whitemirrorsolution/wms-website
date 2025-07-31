import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Only use Routes here

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import UpcomingSection from './components/UpcomingSection';
// import ContactSection from './components/ContactSection';
import ContactPage from './components/ContactPage';

import FinalFooter from './components/FinalFooter';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home'
import AdminLogin from './adminpage/AdminLogin';
import AdminDashboard from './adminpage/AdminDashboard';
import AdminApplications from './adminpage/AdminApplications';
import AdminContacts from './adminpage/AdminContacts';
import ProtectedAdminRoute from './context/ProtectedAdminRoute'; // ✅ Import the protected route
import { useLocation } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <UpcomingSection />
      <ContactPage />
      <FinalFooter />
      <ScrollToTop />
    </>
  );
}

function App() {
    const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/services" element={<ServicesSection />} />
        <Route path="/upcoming" element={<UpcomingSection />} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/career" element={<Home/>} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/application" element={<AdminApplications />} />
        <Route path="/admin/contact" element={<AdminContacts />} />
      </Routes>
   </>
  );
}

export default App;
