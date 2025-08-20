import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import UpcomingSection from './components/UpcomingSection';
import ContactPage from './components/ContactPage';
import JobListings from "./components/JobListings";
// import CareerPage from '../components/CareerPage';


import FinalFooter from './components/FinalFooter';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home'
import AdminLogin from './adminpage/AdminLogin';
import AdminDashboard from './adminpage/AdminDashboard';
import AdminApplications from './adminpage/AdminApplications';
import AdminContacts from './adminpage/AdminContacts';
import ProtectedAdminRoute from './context/ProtectedAdminRoute'; 
import { useLocation } from 'react-router-dom';


function App() {
    const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/services" element={<ServicesSection />} />
        <Route path="/upcoming" element={<UpcomingSection />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/career" element={<JobListings />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/application" element={<AdminApplications />} />
        <Route path="/admin/contact" element={<AdminContacts />} />
      </Routes>
      {!isAdminRoute && <FinalFooter />}
      {!isAdminRoute && <ScrollToTop />}
    </>
  );
}

export default App;