import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keyboard accessibility
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      scrollToTop();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          onKeyPress={handleKeyPress}
          aria-label="Scroll to Top"
          tabIndex={0}
          className="hidden sm:flex fixed bottom-16 sm:bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-white via-sky-100 to-cyan-50 hover:from-blue-800 hover:via-sky-500 hover:to-cyan-400 text-blue-700 hover:text-white flex items-center justify-center shadow-xl shadow-sky-400/30 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-300 hover:scale-110 animate-fadeIn cursor-pointer border border-sky-100 backdrop-blur-xl"
        >
          {/* Up arrow icon (Heroicons style) */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default ScrollToTop;