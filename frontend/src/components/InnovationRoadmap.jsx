// src/components/InnovationRoadmap.jsx

import React from "react";
import { motion } from "framer-motion";

const roadmapData = [
	{
		quarter: "Q2",
		title: "AI Agents Launch",
		description: "Beta release of intelligent automation agents",
		color: "bg-blue-600",
	},
	{
		quarter: "Q3",
		title: "Payment Platform",
		description: "Secure payment gateway with global reach",
		color: "bg-orange-500",
	},
	{
		quarter: "Q4",
		title: "Marketing Suite",
		description: "Complete marketing automation platform",
		color: "bg-green-600",
	},
	{
		quarter: "2025",
		title: "Next Generation",
		description: "Revolutionary technologies in development",
		color: "bg-purple-600",
	},
];

const fadeInUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.12, duration: 0.25 },
	}),
};

const InnovationRoadmap = () => {
	return (
	   <section className="relative py-10 sm:py-14 md:py-20 px-2 sm:px-4 md:px-10 text-gray-900 overflow-hidden bg-gradient-to-br from-white via-sky-100 to-cyan-50">
			{/* Glassy background effect */}
		   <div className="absolute inset-0 pointer-events-none z-0">
			   <div
				   className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[30vh] sm:w-[80vw] sm:h-[40vh] md:h-[60vh] bg-white/80 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/30"
				   style={{ filter: "blur(2px)" }}
			   />
			   <div className="absolute bottom-0 right-0 w-1/2 h-1/4 sm:w-1/3 sm:h-1/3 bg-gradient-to-br from-blue-200/30 via-sky-100/30 to-cyan-100/30 rounded-full blur-2xl" />
		   </div>
		   <div className="relative max-w-6xl mx-auto text-center z-10">
				{/* Heading */}
			   <motion.h2
				   className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"
				   initial={{ opacity: 0, y: -20 }}
				   whileInView={{ opacity: 1, y: 0 }}
				   viewport={{ once: true }}
			   >
				   Innovation Roadmap
			   </motion.h2>

				{/* Subheading */}
			   <motion.p
				   className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto"
				   initial={{ opacity: 0 }}
				   whileInView={{ opacity: 1 }}
				   transition={{ delay: 0.2 }}
				   viewport={{ once: true }}
			   >
				   Our commitment to pushing the boundaries of technology and delivering
				   <span className="font-semibold text-blue-700"> cutting-edge solutions</span> for a brighter tomorrow.
			   </motion.p>

				{/* Roadmap Cards */}
			   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
				   {roadmapData.map((item, i) => (
					   <motion.div
						   key={i}
						   className="relative bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-4 xs:p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl hover:shadow-2xl transition-transform duration-300 group"
						   custom={i}
						   initial="hidden"
						   whileInView="visible"
						   viewport={{ once: true }}
						   variants={fadeInUp}
						   whileHover={{ scale: 1.04 }}
					   >
						   {/* Accent gradient ring */}
						   <div className="absolute -top-2 xs:-top-3 left-1/2 -translate-x-1/2 w-10 xs:w-14 sm:w-16 md:w-20 h-10 xs:h-14 sm:h-16 md:h-20 bg-gradient-to-tr from-blue-400 via-sky-300 to-cyan-200 opacity-20 blur-2xl rounded-full z-0" />
						   <div className="flex flex-col items-center space-y-2 xs:space-y-3 sm:space-y-4 relative z-10">
			   <div
				 className={`w-10 xs:w-12 sm:w-14 md:w-16 h-10 xs:h-12 sm:h-14 md:h-16 rounded-full flex items-center justify-center text-white text-base xs:text-lg sm:text-xl md:text-2xl font-bold shadow-lg border-2 sm:border-4 border-white/40 ${item.color} group-hover:scale-110 transition-transform`}
			   >
				 {item.quarter}
			   </div>
							   <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-sky-700 transition-colors">
								   {item.title}
							   </h3>
							   <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 text-center max-w-[120px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-[200px]">
								   {item.description}
							   </p>
						   </div>
					   </motion.div>
				   ))}
			   </div>

				{/* CTA Section */}
			   <motion.div
				   className="mt-4 sm:mt-6 md:mt-10 bg-white/90 backdrop-blur-2xl border border-slate-200 shadow-2xl p-5 xs:p-7 sm:p-10 md:p-12 rounded-2xl md:rounded-3xl text-center relative overflow-hidden"
				   initial={{ opacity: 0, scale: 0.95 }}
				   whileInView={{ opacity: 1, scale: 1 }}
				   transition={{ duration: 0.3, delay: 0.2 }}
				   viewport={{ once: true }}
			   >
				   {/* Gradient accent background */}
				   <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-700/20 via-sky-400/10 to-cyan-300/10 opacity-80 rounded-2xl md:rounded-3xl" />
				   <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
					   Be First to Experience the Future
				   </h3>
				   <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 md:mb-8 max-w-xs sm:max-w-xl mx-auto">
					   Join our exclusive early access program and get{" "}
					   <span className="font-semibold text-sky-700">priority access</span> to our upcoming innovations.
				   </p>
				   <div className="flex justify-center gap-2 xs:gap-3 sm:gap-4 flex-wrap">
					   <button className="bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 text-white font-bold px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:scale-105 transition-transform text-xs xs:text-sm sm:text-base">
						   Get Early Access
					   </button>
					   {/* <button className="bg-white/90 border border-sky-400 text-sky-700 font-semibold px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow hover:bg-sky-50 hover:text-sky-900 transition text-xs xs:text-sm sm:text-base">
						   Learn More
					   </button> */}
				   </div>
			   </motion.div>
			</div>
		</section>
	);
};

export default InnovationRoadmap;