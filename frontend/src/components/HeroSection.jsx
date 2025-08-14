import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Reusable FeatureBadge component
function FeatureBadge({ text, color = 'from-blue-500 to-amber-400', variant = 'solid', delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{delay , duration: 0.2, type: 'spring', stiffness: 200 }}
      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm shadow-md backdrop-blur-sm select-none border border-white/10 ${
        variant === 'solid'
          ? `bg-gradient-to-r ${color} text-white`
          : 'bg-white/10 text-white border border-white/20'
      }`}
      tabIndex={0}
      aria-label={text}
    >
      {text}
    </motion.span>
  );
}

const defaultBadges = [
  { text: 'Web/App Development', color: 'from-blue-800 to-sky-600', variant: 'solid' },
  { text: 'AI Tools', color: 'from-sky-800 to-cyan-600', variant: 'solid' },
  { text: 'Digital Marketing', color: 'from-blue-800 to-cyan-600', variant: 'solid' },
  { text: 'SaaS Software', color: 'from-cyan-800 to-blue-600', variant: 'solid' },
];

const defaultStats = [
  { value: 50, suffix: '+', label: 'Projects' },
  { value: 99, suffix: '%', label: 'Satisfaction' },
  { value: 24, suffix: '/7', label: 'Support' },
  { value: 5, suffix: '+', label: 'Years' },
];

function HeroSection({
  badges = defaultBadges,
  stats = defaultStats,
  bgImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}) {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
  const controls = useAnimation();

  // Parallax effect for background image
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const bg = document.getElementById('hero-bg-img');
      if (bg) {
        bg.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating dots random movement
  useEffect(() => {
    const dots = document.querySelectorAll('.floating-dot');
    const intervals = [];
    dots.forEach((dot, i) => {
      intervals[i] = setInterval(() => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
  dot.style.transform = `translate(${randomX}px, ${randomY}px)`;
  dot.style.transition = 'transform 1s cubic-bezier(0.4,0,0.2,1)';
      }, 3000 + i * 500);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  // Animate stats on scroll
  useEffect(() => {
    if (statsInView) {
      controls.start('visible');
    }
  }, [statsInView, controls]);

  // Entry animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-screen sm:min-h-screen  pt-24 sm:pt-12 flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-sky-100 to-cyan-50"
      aria-label="WhiteMirror Solutions Hero Section"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          id="hero-bg-img"
          src={bgImage}
          alt="Modern tech office with glass roof"
          className="w-full h-full object-cover transition-transform duration-700 opacity-80"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-sky-100/80 to-cyan-100 opacity-80 backdrop-blur-md"></div>
      </div>
      {/* Floating Dots/Shapes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="floating-dot absolute top-10 left-10 w-8 h-8 bg-gradient-to-br from-blue-200/40 to-cyan-200/30 rounded-full animate-ping"></div>
        <div className="floating-dot absolute top-20 right-16 w-6 h-6 bg-gradient-to-br from-sky-200/40 to-blue-200/30 rounded-full animate-bounce"></div>
        <div className="floating-dot absolute bottom-24 left-1/4 w-5 h-5 bg-gradient-to-br from-cyan-200/40 to-blue-100/30 rounded-full animate-float"></div>
        <div className="floating-dot absolute bottom-10 right-1/3 w-7 h-7 bg-gradient-to-br from-blue-100/40 to-sky-100/30 rounded-full animate-pulse"></div>
      </div>
      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
        >
          {/* Main Headline */}
          <motion.div className="space-y-4" custom={1} variants={fadeUp}>
            <h1 className="font-Inter text-2xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-lg">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-800 via-sky-700 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">Digital Future</span>
            </h1>
            <p className="font-Inter text-base sm:text-lg md:text-xl text-gray-700 max-w-xs sm:max-w-xl mx-auto leading-relaxed">
              Innovative IT solutions for restaurants, web development, and digital marketing. Building tomorrow's technology today.
            </p>
          </motion.div>
          {/* Feature Badges */}
          <motion.div className="flex flex-wrap justify-center gap-2 sm:gap-4" initial="hidden" animate="visible">
            {badges.map((badge, i) => (
              <FeatureBadge
                key={badge.text || badge.label}
                text={badge.text || badge.label}
                color={badge.color}
                variant={badge.variant}
                delay={0.2 + i * 0.12}
              />
            ))}
          </motion.div>
          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-1 sm:gap-3 justify-center items-center pt-1 sm:pt-4" custom={3} variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)' }}
              className="group relative px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-base bg-gradient-to-r from-blue-800 via-sky-600 to-cyan-600 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-400/25 focus:outline-none focus:ring-2 focus:ring-sky-400 border border-sky-100"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Get Started Today"
            >
              <span className="relative z-10">Get Started Today</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-sky-800 to-cyan-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="group px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-base border-2 border-blue-100 text-blue-700 hover:text-blue-900 font-semibold rounded-md transition-all duration-300 backdrop-blur-sm flex items-center gap-1 sm:gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="View Our Work"
            >
              View Our Work
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
          </motion.div>
          {/* Stats Grid */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pt-6 sm:pt-10 pb-2 sm:pb-16 max-w-xs sm:max-w-3xl mx-auto"
            initial="hidden"
            animate={controls}
            variants={fadeUp}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                custom={i + 4}
                variants={fadeUp}
              >
                <motion.div
                className="text-xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-1 sm:mb-2"
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 * (i + 1) }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={statsInView} />
                </motion.div>
                <div className="text-gray-500 text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <div className="hidden sm:flex absolute -bottom-8 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} tabIndex={0} aria-label="Scroll to explore">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-gray-500 text-sm bg-white/80 px-2 rounded-full shadow-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-blue-200 rounded-full flex justify-center items-start bg-white/70 backdrop-blur-sm">
            <div className="w-1 h-3 bg-blue-300 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Animated Counter for stats
function AnimatedCounter({ value, suffix, inView }) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 400;
      const increment = end / (duration / 16);
      let raf;
      function animate() {
        start += increment;
        if (start >= end) {
          setCount(end);
        } else {
          setCount(Math.floor(start));
          raf = requestAnimationFrame(animate);
        }
      }
      animate();
      return () => cancelAnimationFrame(raf);
    }
  }, [inView, value]);
  return <span>{count}{suffix}</span>;
}

export default HeroSection;
