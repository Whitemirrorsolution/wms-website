import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation ,useNavigate} from 'react-router-dom';

const navLinks = [
  { name: 'Home', path: '/' },                            
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Upcoming', path: '/upcoming' },
  { name: 'Contact', path: '/contact' },
  { name: 'Career', path: '/career' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const isHome = location.pathname === '/';
    const headerHeight = 48; // h-16 = 4rem = 64px
    if (!isHome) {
      document.body.style.paddingTop = headerHeight + 'px';
    } else {
      document.body.style.paddingTop = '';
    }
    return () => {
      document.body.style.paddingTop = '';
    };
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-blue-100 transition-all duration-300 ${scrolled ? 'bg-gradient-to-r from-blue-50 via-cyan-100 to-blue-100/95 shadow-lg' : 'bg-white/90'} backdrop-blur-xl`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dfc3isedv/image/upload/v1754297409/WhatsApp_Image_2025-08-04_at_14.17.51_9ea7ca54_u6zyoz.jpg"
                alt="WhiteMirror Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow"
                style={{ borderRadius: '8px' }}
              />
              <span className="hidden lg:inline font-Inter text-xs font-semibold text-gray-600 tracking-tight ml-1">WhiteMirror Solution</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-Inter text-base font-semibold px-2 py-1 rounded-md transition-all duration-200 relative group ${
                  location.pathname === link.path
                    ? 'text-blue-700 bg-blue-100 shadow-sm'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50 hover:shadow'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400 transition-all duration-300 shadow-sm"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${menuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${menuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96' : 'max-h-0 hidden'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-white via-blue-50 to-cyan-50 border-t border-blue-100 shadow-lg rounded-b-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-Inter block px-3 py-2 text-base font-semibold rounded-md transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-700 bg-blue-100 shadow-sm'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50 hover:shadow'
                }`}
              >
                {link.name}
              </Link>
            ))}
           
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
