import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';

// Reusable FeatureCard
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <motion.div
  className="flex items-start space-x-2 sm:space-x-3 bg-white rounded-xl p-2 sm:p-4 shadow border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
  tabIndex={0}
  aria-label={title}
>
  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-white text-base sm:text-lg font-bold shadow-sm">
    {icon}
  </div>
  <div>
    <h4 className="font-Inter font-semibold text-gray-900 mb-0.5 text-sm sm:text-base">{title}</h4>
    <p className="font-Inter text-xs sm:text-sm text-gray-600">{desc}</p>
  </div>
</motion.div>

  );
}

// Reusable MissionCard
function MissionCard({ icon, title, desc, bg = 'bg-blue-100', delay = 0 }) {
  return (
   <motion.div
  className={`text-center p-2 sm:p-8 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 ${bg}`}
  initial={{ opacity: 0, scale: 0.98, y: 15 }}
  whileInView={{ opacity: 1, scale: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
  whileHover={{ scale: 1.03, borderColor: '#3b82f6' }}
  tabIndex={0}
  aria-label={title}
>
  <div
    className={`w-6 h-6 sm:w-16 sm:h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-6 text-base sm:text-2xl`}
    role="img"
    aria-label={title + ' icon'}
  >
    {icon}
  </div>
  <h3 className="font-Inter text-[13px] sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-4">
    {title}
  </h3>
  <p className="font-Inter text-[11px] sm:text-sm text-gray-600 leading-snug">
    {desc}
  </p>
</motion.div>

  );
}

const defaultFeatures = [
  { icon: '👨‍💻', title: 'Expert Team', desc: 'Skilled professionals with 5+ years experience' },
  { icon: '⏰', title: '24/7 Support', desc: 'Round-the-clock assistance for all clients' },
  { icon: '💡', title: 'Innovation Focus', desc: 'Cutting-edge solutions for modern challenges' },
  { icon: '🏆', title: 'Proven Results', desc: '99% client satisfaction rate' },
];

const defaultMissionCards = [
  { icon: '🎯', bg: 'bg-blue-100', title: 'Our Mission', desc: 'Empowering businesses with innovative technology solutions that drive growth and digital transformation.' },
  { icon: '🚀', bg: 'bg-amber-100', title: 'Our Vision', desc: 'To be the leading IT solutions provider, setting new standards in technology innovation and client satisfaction.' },
  { icon: '💎', bg: 'bg-green-100', title: 'Our Values', desc: 'Excellence, innovation, integrity, and client-first approach guide everything we do at WhiteMirror Solutions.' },
];

function AnimatedCounter({ value, inView, suffix = '' }) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    let raf;
    if (inView) {
      let start = 0;
      const end = value;
  const duration = 400;
      const increment = end / (duration / 16);
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
    }
    return () => raf && cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span>{count}{suffix}</span>;
}

function AboutSection({
  heading = 'About WhiteMirror Solutions',
  subtext = 'Pioneering digital transformation with cutting-edge technology solutions that drive business growth and innovation.',
  features = defaultFeatures,
  missionCards = defaultMissionCards,
  contact = { address: '669, A-2, SCH No.136, Indore-452010', phone: '79874-35108', email: 'contact@whitemirror.in' }
}) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const statsCardRef = useRef(null);
  const missionRef = useRef(null);
  const imagesRef = useRef(null);
  const contactRef = useRef(null);

  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });
  const statsInView = useInView(statsCardRef, { once: true, margin: '-100px' });
  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });
  const imagesInView = useInView(imagesRef, { once: true, margin: '-100px' });
  const contactInView = useInView(contactRef, { once: true, margin: '-100px' });

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="about" ref={sectionRef} className="relative  py-8 sm:py-20 px-4 bg-gradient-to-br from-white via-sky-100 to-cyan-50 overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-r from-blue-100 via-sky-100 to-cyan-100 opacity-60 blur-2xl rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-gradient-to-r from-cyan-100 via-sky-100 to-blue-100 opacity-40 blur-2xl rounded-full"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10 px-1 sm:px-0">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeLeft}
        >
          <h2 className="font-Inter text-2xl sm:text-4xl md:text-6xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            {heading}
          </h2>
          <p className="font-Inter text-sm sm:text-xl text-gray-700 max-w-xs sm:max-w-2xl mx-auto font-medium">
            {subtext}
          </p>
        </motion.div>

        <div ref={gridRef} className="grid lg:grid-cols-2 gap-6 sm:gap-16 items-center mb-10 sm:mb-20">
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <div className="space-y-3 sm:space-y-6">
              <h3 className="font-Inter text-base sm:text-3xl font-bold text-gray-900">
                Building Tomorrow's Technology Today
              </h3>
              <p className="font-Inter text-xs sm:text-lg text-gray-600 leading-relaxed">
                WhiteMirror Solutions transforms businesses through innovative IT solutions. From restaurant SaaS platforms to custom web development, we deliver excellence.
              </p>
              <p className="font-Inter text-xs sm:text-lg text-gray-600 leading-relaxed">
                Our expertise spans digital marketing, AI agents, payment gateways, and marketing tools that empower businesses to thrive in the digital age.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-8">
              {features.map((f, i) => (
                <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} delay={0.1 + i * 0.12} />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            variants={fadeUp}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[16/10] w-full max-w-xs sm:max-w-xl mx-auto group border border-sky-100 bg-white/80 backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1515923256482-1c04580b477c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzQ2fDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTI1MjB0ZWNoJTI1MjBvZmZpY2UlMjUyMGJyaWdodCUyNTIwcHJvZmVzc2lvbmFsfGVufDF8MHx8fDE3NDg1OTI5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern tech office in blue"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-200/30 to-cyan-100/10"></div>
            </div>

            <motion.div
              ref={statsCardRef}
              className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white/90 rounded-xl shadow-xl p-3 sm:p-6 border border-sky-100"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={statsInView ? { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, bounce: 0.4, duration: 0.4 } } : {}}
           transition={{ type: 'spring', stiffness: 200, bounce: 0.4, duration: 0.4 }}
            >
              <div className="text-center">
                <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-1">
                  <AnimatedCounter value={50} inView={statsInView} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Projects Completed</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          ref={missionRef}
          className="grid md:grid-cols-3 gap-4 sm:gap-10 mb-8 sm:mb-16"
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {missionCards.map((card, i) => (
            <MissionCard key={card.title} icon={card.icon} title={card.title} desc={card.desc} bg={card.bg} delay={0.1 + i * 0.15} />
          ))}
        </motion.div>
          {/* office Images */}
        <motion.section
          ref={imagesRef}
          className="py-8 sm:py-16 bg-white/90 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10">
              {[
                {
                  img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
                  title: "Modern Workspace",
                  desc: "Collaborative environment for innovation"
                },
                {
                  img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
                  title: "Innovation Hub",
                  desc: "Where ideas become reality"
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden border border-blue-100 bg-white/90 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 rounded-2xl backdrop-blur-md"
                >
                  <div className="relative h-40 sm:h-64">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-200/40 to-cyan-100/10 rounded-2xl"></div>
                    <div className="absolute bottom-2 left-2 sm:bottom-6 sm:left-6 text-white z-10 transform group-hover:-translate-y-2 transition-transform duration-300">
                      <h3 className="text-base sm:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg">{item.title}</h3>
                      <p className="text-blue-50 text-xs sm:text-base drop-shadow">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
       {/* Contact Info */}
        <motion.section
          ref={contactRef}
          className="py-8 sm:py-16 bg-gradient-to-br from-white via-sky-100 to-cyan-50/80 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-1 sm:px-6 lg:px-20 text-center">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-6 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight inline-block px-3 sm:px-6 py-1 sm:py-2 rounded-xl shadow-md border border-sky-100/60 backdrop-blur-sm">
              Get In Touch
            </h2>
            <p className="text-xs sm:text-lg text-gray-700 mb-4 sm:mb-10 max-w-xs sm:max-w-xl mx-auto font-medium">We'd love to hear from you. Reach out for a consultation, partnership, or just to say hello!</p>
            <div className="flex flex-row gap-2 sm:gap-12 max-w-xs sm:max-w-2xl mx-auto justify-center items-stretch">
              <a href="https://www.google.com/maps?q=669,+A-2,+SCH+No.136,+Indore-452010" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center text-center group cursor-pointer bg-white/90 border border-sky-100 rounded-xl p-1.5 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-0 max-w-[90px] sm:max-w-none">
                <div className="w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 rounded-full flex items-center justify-center mb-1 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <MapPin className="w-4 h-4 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-2 text-xs sm:text-lg">Address</h4>
                <p className="hidden sm:flex text-gray-600 text-[10px] sm:text-base text-center font-medium truncate">669, A-2, SCH No.136, Indore-452010</p>
              </a>

              <a href="tel:+917987435108" className="flex-1 flex flex-col items-center text-center group cursor-pointer bg-white/90 border border-sky-100 rounded-xl p-1.5 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-0 max-w-[90px] sm:max-w-none">
                <div className="w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 rounded-full flex items-center justify-center mb-1 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Phone className="w-4 h-4 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-2 text-xs sm:text-lg">Contact</h4>
                <p className="hidden sm:flex text-gray-600 text-[10px] sm:text-base font-medium truncate">+91 79874-35108</p>
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
}

export default AboutSection;