import React from "react";
import { motion } from "framer-motion";
import InnovationRoadmap  from "./InnovationRoadmap";

// Feature cards data
const features = [
  {
    title: "AI Agents",
    badgeColor: "bg-blue-600",
    description:
      "Intelligent automation agents that handle customer service, data analysis, and business processes autonomously.",
    points: [
      "Natural Language Processing",
      "24/7 Customer Support",
      "Predictive Analytics",
    ],
    button: "Get Early Access",
    buttonColor: "bg-blue-700 hover:bg-blue-800",
  },
  {
    title: "Payment Gateways",
    badgeColor: "bg-orange-500",
    description:
      "Secure, fast, and flexible payment processing solutions with multi-currency support and fraud protection.",
    points: [
      "Multi-Currency Support",
      "Advanced Fraud Detection",
      "Real-time Analytics",
    ],
    button: "Join Waitlist",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  },
  {
    title: "Marketing Tools",
    badgeColor: "bg-green-600",
    description:
      "Comprehensive marketing automation platform with AI-powered insights and omnichannel campaign management.",
    points: [
      "Campaign Automation",
      "Customer Segmentation",
      "Performance Analytics",
    ],
    button: "Request Demo",
    buttonColor: "bg-green-700 hover:bg-green-800",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.3 },
  }),
};

const UpcomingSection = () => {
  return (
    <section id="upcoming" className="relative py-10 sm:py-14 md:py-20 px-2 sm:px-4 md:px-10 text-gray-900 overflow-hidden bg-gradient-to-br from-white via-sky-100 to-cyan-50">
      {/* Glassy background effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[30vh] sm:w-[80vw] sm:h-[40vh] md:h-[60vh] bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/30" style={{ filter: 'blur(2px)' }} />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/4 sm:w-1/3 sm:h-1/3 bg-gradient-to-br from-blue-200/30 via-sky-100/30 to-cyan-100/30 rounded-full blur-2xl" />
      </div>
      <div className="relative max-w-7xl mx-auto text-center z-10">
        {/* Heading */}
        <motion.h2
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1.5 sm:mb-3 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg font-Inter tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Upcoming Innovations
        </motion.h2>

        {/* Subheading */}
        <motion.p
          className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-6 max-w-xs xs:max-w-sm sm:max-w-xl mx-auto font-medium font-Inter"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          Revolutionary technologies in development that will reshape the future of <span className="font-semibold text-blue-700">business automation</span> and <span className="font-semibold text-orange-500">digital innovation</span>.
        </motion.p>

        {/* Coming Soon Badge */}
        <motion.div
          className="inline-block px-4 xs:px-5 py-1.5 xs:py-2 rounded-full bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 text-white font-semibold shadow-lg mb-6 sm:mb-12 tracking-wide text-xs xs:text-sm sm:text-lg border-2 border-sky-100/40 drop-shadow-xl"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.2 }}
          viewport={{ once: true }}
        >
          🚀 Coming Soon - 2025
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 md:gap-10 mt-5 sm:mt-10 text-left">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl mx-4 sm:mx-2 p-4 xs:p-5 sm:p-7 md:p-10 rounded-2xl md:rounded-3xl hover:shadow-2xl transition-transform duration-300 group overflow-hidden"
              custom={index}
              initial="hidden"
              whileInView="show"
              variants={fadeInUp}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, duration: 0.2 }}
            >
              {/* Accent gradient ring */}
              <div className="absolute -top-2 xs:-top-3 left-1/2 -translate-x-1/2 w-10 xs:w-14 sm:w-16 md:w-20 h-10 xs:h-14 sm:h-16 md:h-20 bg-gradient-to-tr from-blue-400 via-sky-300 to-cyan-200 opacity-20 blur-2xl rounded-full z-0" />

              <h3 className="text-lg xs:text-xl sm:text-2xl font-extrabold mt-2 xs:mt-3 sm:mt-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg font-Inter relative z-10">{feature.title}</h3>
              <p className="mt-2 xs:mt-2.5 sm:mt-3 text-xs xs:text-sm sm:text-base text-gray-700 min-h-[32px] xs:min-h-[48px] sm:min-h-[64px] relative z-10">
                {feature.description}
              </p>
              <ul className="mt-3 xs:mt-4 sm:mt-5 space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-700 list-disc list-inside pl-2 relative z-10">
                {feature.points.map((point, idx) => (
                  <li key={idx} className="pl-1">{point}</li>
                ))}
              </ul>
              <button
                className={`mt-4 xs:mt-6 sm:mt-8 w-full text-white px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-md sm:rounded-lg font-semibold shadow-md transition-all duration-200 ${feature.buttonColor} border border-white/40 hover:scale-105 relative z-10 text-xs xs:text-sm sm:text-base`}
              >
                {feature.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="relative z-10 mt-8 sm:mt-12 md:mt-16">
        <InnovationRoadmap/>
      </div>
    </section>
  );
};

export default UpcomingSection;