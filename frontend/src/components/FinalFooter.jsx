import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const defaultServices = [
	{ label: 'App Dev.', icon: '💻' },
	{ label: 'Restaurant SaaS', icon: '🍽' },
	{ label: 'Cloud Solutions', icon: '☁' },
	{ label: 'Web Dev.', icon: '🌐' },
	{ label: 'Digital Marketing', icon: '📈' },
	{ label: 'IT Consulting', icon: '🧑‍💼' },
];

const defaultContact = [
	{ icon: '📍', label: 'Indore, MP' },
	{ icon: '📞', label: '79874-35108' },
	{ icon: '✉', label: 'whitemirrorsolution@gmail.com' },
];

const socials = [
	{
		icon: <FaLinkedin />,
		href: 'https://www.linkedin.com/company/whitemirror-solution-pvt-ltd/posts/?feedView=all',
		label: 'LinkedIn',
	},
	{
		icon: <FaInstagram />,
		href: 'https://www.instagram.com/wms.pvt.ltd?igsh=ZmxsMm1yMnFyYmph',
		label: 'Instagram',
	},
	{
		icon: <FaWhatsapp />,
		href: 'https://wa.me/917987435108',
		label: 'WhatsApp',
	},
];

const fadeInVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: (i = 1) => ({
		opacity: 1,
		y: 0,
		transition: { delay: 0.08 * i, duration: 0.3, ease: 'easeOut' },
	}),
};

const FooterCombined = ({
	showSocials = true,
	services = defaultServices,
	contactDetails = defaultContact,
	address = '669, A-2, SCH No.136, Indore-452010',
	phoneNumber = '79874-35108',
	companyName = 'WhiteMirror Solution',
}) => {
	return (
		<>
			<motion.footer
				className="relative bg-gradient-to-br from-white via-sky-100 to-cyan-50 py-8 xs:py-10 sm:py-12 md:py-16 px-3 xs:px-4 sm:px-6 md:px-8 mt-0 overflow-hidden border-t border-blue-100/40 shadow-xl"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={fadeInVariants}
			>
				{/* Background Blob */}
				<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] z-0 pointer-events-none">
					<svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<radialGradient id="footerMainBlobLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
								<stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
								<stop offset="100%" stopColor="#a21caf" stopOpacity="0.06" />
							</radialGradient>
						</defs>
						<ellipse cx="300" cy="100" rx="260" ry="70" fill="url(#footerMainBlobLight)" />
					</svg>
				</div>

				<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 xs:gap-7 sm:gap-10 relative z-10">
					{/* Company Info */}
					<motion.div
						custom={1}
						variants={fadeInVariants}
						whileHover={{
							scale: 1.04,
							filter: 'drop-shadow(0 0 12px #38bdf8)',
						}}
					>
						<div className="text-lg xs:text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-1 xs:gap-2 mb-1 xs:mb-2 animate-pulse">
							WhiteMirror <span className="text-sky-500">Solution</span>
						</div>
						<div className="text-xs xs:text-sm sm:text-base mb-1 xs:mb-2 text-gray-600">Elevating Digital Innovation</div>
						<motion.div
							className="h-0.5 xs:h-1 w-10 xs:w-16 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 rounded-full animate-gradient-x"
							layoutId="footer-underline"
						/>
					</motion.div>

					{/* Quick Links & Services */}
					<div className="col-span-1 sm:col-span-2 flex flex-row gap-2 xs:gap-4 sm:gap-6 items-start w-full">
						{/* Quick Links (Manual) */}
						<motion.div custom={2} variants={fadeInVariants} className="w-1/2">
							<div className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 mb-1 xs:mb-2">
								Quick Links
							</div>
							<ul className="space-y-0 sm:space-y-1">
								<li>
									<motion.a href="/" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>Home</motion.a>
								</li>
								<li>
									<motion.a href="/about" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>About</motion.a>
								</li>
								<li>
									<motion.a href="/services" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>Services</motion.a>
								</li>
								<li>
									<motion.a href="/upcoming" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>Upcoming</motion.a>
								</li>
								<li>
									<motion.a href="/contact" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>Contact</motion.a>
								</li>
								<li>
									<motion.a href="/career" className="hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm" whileHover={{ scale: 1.06, color: '#2563eb' }}>Career</motion.a>
								</li>
							</ul>
						</motion.div>

						{/* Services */}
						<motion.div custom={3} variants={fadeInVariants} className="w-1/2">
							<div className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 mb-1 xs:mb-2">
								Services
							</div>
							<ul className="space-y-2 xs:space-y-1">
								{services.map((srv) => (
									<li key={srv.label} className="flex items-center gap-1 xs:gap-2">
										<motion.span className="text-xs xs:text-sm sm:text-base" whileHover={{ scale: 1.12, color: '#38bdf8' }}>
											{srv.icon}
										</motion.span>
										<span className="hover:text-blue-600 underline-offset-4 transition-all duration-300 font-medium text-[10px] xs:text-xs sm:text-sm">
											{srv.label}
										</span>
									</li>
								))}
							</ul>
						</motion.div>
					</div>

					{/* Contact Info */}
					<motion.div custom={4} variants={fadeInVariants}>
						<div className="text-base xs:text-lg font-semibold text-gray-900 mb-2 xs:mb-3">Contact</div>
						<ul className="space-y-0.5 sm:space-y-3 mb-2 xs:mb-4">
							{contactDetails.map((c) => (
								<li key={c.label} className="flex items-center gap-3">
									<motion.span
										className="bg-blue-100 text-blue-600 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-base xs:text-lg sm:text-xl shadow-md"
										whileHover={{ scale: 1.2, color: '#2563eb' }}
									>
										{c.icon}
									</motion.span>
									<span className="text-gray-700 font-medium text-xs xs:text-sm sm:text-base">
										{c.label}
									</span>
								</li>
							))}
						</ul>

						{/* Socials */}
						{showSocials && (
							<div className="flex justify-evenly xs:gap-3 sm:gap-4 mt-4">
								{socials.map((s) => (
									<motion.a
										key={s.label}
										href={s.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={s.label}
										className="text-lg xs:text-xl sm:text-2xl text-gray-400 hover:text-blue-600 transition-transform duration-300"
										whileHover={{
											scale: 1.25,
											rotate: [0, 10, -10, 0],
											color: '#2563eb',
											boxShadow: '0 4px 24px 0 rgba(56,189,248,0.15)',
										}}
										whileTap={{ scale: 1.03 }}
										transition={{ type: 'spring', stiffness: 400, damping: 18 }}
									>
										{s.icon}
									</motion.a>
								))}
							</div>
						)}
					</motion.div>
				</div>

				{/* Footer Bottom */}
				<motion.div
					className="border-t border-blue-100/40 mt-4 xs:mt-8 pt-2 xs:pt-4 relative z-10"
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ delay: 0.5, duration: 0.3 }}
				>
					<div className="text-[10px] xs:text-xs text-gray-500 text-center">
						© 2025 WhiteMirror Solution Pvt. Ltd. All rights reserved.
					</div>
				</motion.div>
			</motion.footer>
		</>
	);
};

export default FooterCombined;
