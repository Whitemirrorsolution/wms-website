import { useState } from "react";
import axios from "axios";

const JobPostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    jobType: "",
    description: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await axios.post("https://wms-website.onrender.com/api/jobs/create", formData, {
        withCredentials: true,
      });
      setSuccess("Job posted successfully!");
      setFormData({ title: "", department: "", location: "", jobType: "", description: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-4 text-center">
        <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Post New Job</span>
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" name="title" placeholder="Job Title" required value={formData.title} onChange={handleChange} className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
        <input type="text" name="department" placeholder="Department" required value={formData.department} onChange={handleChange} className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" name="location" placeholder="Location" required value={formData.location} onChange={handleChange} className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
        <input type="text" name="jobType" placeholder="Job Type (Full-time/Part-time)" required value={formData.jobType} onChange={handleChange} className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none" />
      </div>
      <textarea name="description" placeholder="Short Description" required value={formData.description} onChange={handleChange} className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none resize-none min-h-[80px]"></textarea>

      {success && <p className="text-green-600 text-center font-semibold">{success}</p>}
      {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

      <div className="flex justify-center">
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition-colors duration-200 px-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          Post Job
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;
