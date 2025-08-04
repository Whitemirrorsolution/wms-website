

import { useEffect, useState } from "react";
import axios from "axios";
import ApplyModal from "./ApplyModal";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios.get("https://wms-website.onrender.com/api/career/jobs").then((res) => {
      setJobs(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl pt-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-blue-800 tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">Current Openings</span>
        </h1>

        <div className="w-full flex justify-center mb-8">
          <div className="h-1 w-24 bg-blue-400 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 flex flex-col transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200 relative overflow-hidden group"
            >
              <div className="absolute -top-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#3B82F6" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2 truncate" title={job.title}>{job.title}</h2>
              <p className="text-blue-500 font-medium mb-1">{job.department}</p>
              <p className="text-gray-500 text-sm mb-2">
                <span className="inline-block mr-2"><svg className="inline w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z" /></svg>{job.location}</span>
                <span className="inline-block"><svg className="inline w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm0 2h8v12H6V4zm2 2v8h4V6H8z" /></svg>{job.type || job.jobType}</span>
              </p>
              <p className="text-gray-700 flex-1 mb-4 line-clamp-4">{job.description}</p>
              <button
                className="mt-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                onClick={() => setSelectedJob(job)}
              >
                Apply Now
              </button>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        {selectedJob && (
          <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </div>
    </div>
  );
};

export default JobListings;
