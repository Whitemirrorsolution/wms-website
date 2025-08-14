import React from 'react';
import { motion } from 'framer-motion';

function TimelineItem({ quarter, title, description, isActive = false }) {
  return (
    <motion.div
      className="relative flex flex-col items-center text-center px-4 py-6 min-w-[140px] md:min-w-[180px] group bg-gradient-to-br from-white via-sky-100 to-cyan-50/80 backdrop-blur-xl border border-sky-100 shadow-xl rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 overflow-visible"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      tabIndex={0}
      aria-label={title}
    >
      {/* Accent gradient ring */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-tr from-blue-400 via-sky-300 to-cyan-200 opacity-20 blur-2xl rounded-full z-0" />
      {/* Timeline Dot + Line */}
      <div className="flex flex-col items-center relative z-10">
        <motion.div
          className={`w-5 h-5 rounded-full mb-2 border-4 ${isActive ? 'bg-gradient-to-tr from-blue-700 via-sky-400 to-cyan-400 animate-pulse ring-2 ring-sky-400 scale-110' : 'bg-gray-400 border-gray-300'} group-hover:scale-110 transition-transform duration-200 shadow-lg`}
          whileHover={{ scale: 1.10 }}
        />
        {/* Connecting line (hidden on last item, handled by parent if needed) */}
        <div className="h-10 w-0.5 bg-gradient-to-b from-blue-200 via-slate-200 to-cyan-200 mx-auto"></div>
      </div>
      {/* Quarter */}
      <div className="text-xs uppercase text-gray-500 mb-1 tracking-wide font-semibold relative z-10">{quarter}</div>
      {/* Title */}
      <div className="text-lg font-extrabold bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent mb-1 group-hover:text-sky-700 transition-colors duration-200 drop-shadow relative z-10">
        {title}
      </div>
      {/* Description */}
      {description && <div className="text-sm text-gray-600 mt-1 relative z-10">{description}</div>}
    </motion.div>
  );
}

export default TimelineItem;