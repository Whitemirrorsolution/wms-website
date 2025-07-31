import React from 'react';
import { motion } from 'framer-motion';

// Service data
const defaultServices = [
	{
		title: 'App Development',
		desc: 'Custom mobile and web apps for business growth.',
		
		icon: 'https://img.icons8.com/?size=100&id=Nopy6eQh4zfT&format=png&color=000000',
		features: ['CMS Integration', 'API Development', 'Cross-Platform'],
		accent: 'bg-blue-100',
	},
	{
		title: 'Restaurant SaaS',
		desc: 'Complete restaurant management platform.',
		icon: 'https://img.icons8.com/?size=100&id=115346&format=png&color=000000',
		features: ['Point of sale system', 'Inventory management', 'Real-time analytics'],
		accent: 'bg-amber-100',
	},
	{
		title: 'Cloud Solutions',
		desc: 'Secure, scalable cloud infrastructure & migration.',
		icon: 'https://img.icons8.com/color/48/000000/cloud.png',
		features: ['AWS/Azure', 'DevOps', 'Data Backup'],
		accent: 'bg-green-100',
	},
	{
		title: 'Web Development',
		desc: 'Custom websites and web applications build with modern technologies',
		icon: 'https://img.icons8.com/color/48/000000/source-code.png',
		features: ['Responsive design', 'E-commerce solutions', 'CMS integration'],
		accent: 'bg-blue-100',
	},
	{
	title: 'Digital Marketing',
	desc: 'SEO, SEM, and social media for business visibility.',
	icon: 'https://img.icons8.com/?size=100&id=xOxAdcl6DVo2&format=png&color=000000',
	features: ['SEO/SEM', 'Content Strategy', 'Analytics'],
	accent: 'bg-amber-100',
},
{
	title: 'IT Consulting',
	desc: 'Expert advice for digital transformation.',
	icon: 'https://img.icons8.com/?size=100&id=R1kC9AoaoQgQ&format=png&color=000000',
	features: ['Strategy', 'Security', 'Process Audit'],
	accent: 'bg-green-100',
},

];

const defaultProcessSteps = [
	{
		title: 'Planning',
		desc: 'We analyze your needs and define a clear roadmap.',
		icon: '📝',
	},
	{
		title: 'Design',
		desc: 'Wireframes, prototypes, and UI/UX for every device.',
		icon: '🎨',
	},
	{
		title: 'Development',
		desc: 'Agile coding, integrations, and rigorous testing.',
		icon: '💻',
	},
	{
		title: 'Launch & Support',
		desc: 'Go live with confidence and ongoing support.',
		icon: '🚀',
	},
];

// Animation variants
const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	visible: (i = 1) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	}),
};
const fadeDown = {
	hidden: { opacity: 0, y: -40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
	visible: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

function ServiceCard({ icon, title, desc, features, accent, index }) {
  return (
	<motion.div
	  className={`group relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 ${accent}`}
	  initial="hidden"
	  whileInView="visible"
	  viewport={{ once: true, amount: 0.3 }}
	  custom={index + 1}
	  variants={fadeUp}
	  whileHover={{ scale: 1.06 }}
	  tabIndex={0}
	  aria-label={title}
	>
	  {/* Accent gradient ring */}
	  <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-400 via-sky-300 to-cyan-200 opacity-20 blur-2xl rounded-full z-0" />
	  <div className="mb-2 sm:mb-4 relative z-10">
		<motion.img
		  src={icon}
		  alt={title + ' icon'}
		  className="h-8 w-8 sm:h-14 sm:w-14 object-cover mx-auto transition-transform duration-300 group-hover:scale-110 drop-shadow-xl"
		  loading="lazy"
		  whileHover={{ rotate: 10, scale: 1.15 }}
		/>
	  </div>
	  <h3 className="font-Inter font-sans text-base sm:text-xl font-extrabold text-gray-900 mb-1 sm:mb-2 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg relative z-10">{title}</h3>
	  <p className="font-Inter font-sans text-xs sm:text-base text-gray-700 mb-2 sm:mb-4 relative z-10">{desc}</p>
	  <ul className="space-y-1 sm:space-y-2 w-full relative z-10">
		{features.map((f, i) => (
		  <li key={f} className="flex items-center justify-center space-x-1 sm:space-x-2">
			<span className="w-1.5 h-1.5 sm:w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200 inline-block mr-1 sm:mr-2 animate-pulse" aria-label="feature dot"></span>
			<span className="font-Inter font-sans text-gray-700 text-[11px] sm:text-sm">{f}</span>
		  </li>
		))}
	  </ul>
	</motion.div>
  );
}

function ProcessStep({ step, title, desc, icon, index }) {
	return (
		<motion.div
			className="flex flex-col items-center text-center bg-white rounded-xl shadow border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
			custom={index + 1}
			variants={fadeUp}
			whileHover={{ scale: 1.06, borderColor: '#3b82f6' }}
			tabIndex={0}
			aria-label={title}
		>
			<motion.div
				className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg mb-3 shadow-lg transition-transform duration-300 animate-bounce"
				whileHover={{ scale: 1.12 }}
			>
				{icon || step}
			</motion.div>
			<h4 className="font-Inter font-sans text-base font-bold text-gray-900 mb-1">{title}</h4>
			<p className="font-Inter font-sans text-gray-600 text-sm">{desc}</p>
		</motion.div>
	);
}

function ServicesSection({ services = defaultServices, processSteps = defaultProcessSteps }) {
  return (
  <section id="services" className="relative py-4 sm:py-20 px-4 bg-gradient-to-br from-white via-sky-100 to-cyan-50 overflow-hidden">
	  {/* Glassy background effect */}
  <div className="absolute inset-0 pointer-events-none z-0">
	<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30" style={{ filter: 'blur(2px)' }} />
	<div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/30 via-sky-100/30 to-cyan-100/30 rounded-full blur-2xl" />
  </div>
	  <div className="relative max-w-7xl mx-auto z-10">
		{/* Section Header */}
	<motion.div
	  className="text-center mb-6 sm:mb-14"
		  initial="hidden"
		  whileInView="visible"
		  viewport={{ once: true, amount: 0.5 }}
		  variants={fadeDown}
		>
	  <h2 className="font-Inter font-sans text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
			Services
		  </h2>
		  <p className="font-Inter font-sans px-8 sm:px-0 text-xs sm:text-lg text-gray-700 max-w-xl mx-auto">
			Comprehensive IT solutions tailored to your business needs, delivered with <span className="font-semibold text-blue-700">innovation</span> and <span className="font-semibold text-orange-500">expertise</span>.
		  </p>
		</motion.div>
		{/* Services Grid */}
	<motion.div
	  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 md:gap-10 mb-10 sm:mb-20"
	  variants={stagger}
	  initial="hidden"
	  whileInView="visible"
	  viewport={{ once: true, amount: 0.2 }}
	>
	  {services.map((s, i) => (
		<ServiceCard key={s.title} {...s} index={i} />
	  ))}
	</motion.div>
		{/* Development Process */}
	<motion.div
	  className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 max-w-5xl mx-auto mb-4 sm:mb-10"
		  initial="hidden"
		  whileInView="visible"
		  viewport={{ once: true, amount: 0.3 }}
		  variants={fadeUp}
		>
	  <h3 className="font-Inter font-sans text-lg sm:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-4 text-center bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
		Our Development Process
	  </h3>
	  <p className="font-Inter font-sans text-xs sm:text-base text-gray-700 mb-4 sm:mb-8 text-center max-w-2xl mx-auto">
		We follow a proven, agile methodology to deliver high-quality solutions on time and within budget.
	  </p>
	  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
		{processSteps.map((step, i) => (
		  <motion.div
			key={step.title}
			className="flex flex-col items-center text-center bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.3 }}
			custom={i + 1}
			variants={fadeUp}
			whileHover={{ scale: 1.06, borderColor: '#3b82f6' }}
			tabIndex={0}
			aria-label={step.title}
		  >
			<motion.div
			  className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base sm:text-lg mb-2 sm:mb-3 shadow-lg transition-transform duration-300 animate-bounce"
			  whileHover={{ scale: 1.12 }}
			>
			  {step.icon || step.step}
			</motion.div>
			<h4 className="font-Inter font-sans text-xs sm:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">{step.title}</h4>
			<p className="font-Inter font-sans text-[11px] sm:text-sm text-gray-600">{step.desc}</p>
		  </motion.div>
		))}
	  </div>
		</motion.div>
		{/* Call to Action */}
	<motion.div
	  className="text-center mt-10 sm:mt-16 bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 max-w-md sm:max-w-2xl md:max-w-3xl mx-auto relative overflow-hidden"
		  initial="hidden"
		  whileInView="visible"
		  viewport={{ once: true, amount: 0.5 }}
		  variants={fadeUp}
		>
	  {/* Gradient accent background */}
	  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700/20 via-sky-400/10 to-cyan-300/10 opacity-80 rounded-2xl sm:rounded-3xl" />
	  <h3 className="font-Inter font-sans text-lg sm:text-2xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
		Ready to Transform Your Business?
	  </h3>
	  <p className="font-Inter font-sans text-xs sm:text-base text-gray-700 mb-3 sm:mb-6 max-w-xs sm:max-w-xl mx-auto">
		Let’s discuss your project and build something amazing together.
	  </p>
	  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
		<motion.button
		  className="px-4 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 text-white font-bold rounded-lg sm:rounded-xl shadow-lg hover:scale-105 transition-transform text-xs sm:text-base"
		  whileHover={{
			scale: 1.08,
			boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)',
		  }}
		  whileTap={{ scale: 0.97 }}
		  onClick={() => {
			const contact = document.getElementById('contact');
			if (contact) contact.scrollIntoView({ behavior: 'smooth' });
		  }}
		  aria-label="Get Free Consultation"
		>
		  Get Free Consultation
		</motion.button>
		<motion.button
		  className="px-4 py-2 sm:px-8 sm:py-3 bg-white/90 border border-sky-400 text-sky-700 font-semibold rounded-lg sm:rounded-xl shadow hover:bg-sky-50 hover:text-sky-900 transition text-xs sm:text-base"
		  whileHover={{ scale: 1.08 }}
		  whileTap={{ scale: 0.97 }}
		  onClick={() => {
			window.open('#portfolio', '_self');
		  }}
		  aria-label="View Portfolio"
		>
		  View Portfolio
		</motion.button>
	  </div>
		</motion.div>
	  </div>
	</section>
  );
}

export default ServicesSection;