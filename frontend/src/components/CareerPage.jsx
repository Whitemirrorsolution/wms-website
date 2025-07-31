import { useEffect, useState } from "react";
import axios from "axios";

const CareerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Current Job Openings
      </h1>

      {loading ? (
        <p className="text-center">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center">No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-4 rounded shadow border">
              <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
              <p className="text-gray-700">{job.department}</p>
              <p className="text-gray-500 text-sm">
                {job.location} | {job.jobType}
              </p>
              <p className="mt-2">{job.description}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerPage;
