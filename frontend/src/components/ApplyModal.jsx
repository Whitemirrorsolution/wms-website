import { useState } from "react";
import axios from "axios";

const ApplyModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    qualification: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // ✅ New: error message

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("appliedJobTitle", job.title);
    data.append("resume", resume);

    try {
      const res = await axios.post("http://localhost:8000/api/career/apply", data);
      setSuccessMsg(res.data.message || "Application submitted successfully.");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-0">
      <div className="bg-white p-4 sm:p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-blue-100 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Apply for{" "}
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            {job.title}
          </span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="fullName"
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              name="email"
              type="email"
              onChange={handleChange}
              required
              placeholder="Email"
              className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="phone"
              onChange={handleChange}
              required
              placeholder="Phone"
              className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              name="dateOfBirth"
              type="date"
              onChange={handleChange}
              required
              className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              name="qualification"
              onChange={handleChange}
              required
              placeholder="Highest Qualification"
              className="flex-1 border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <div className="flex items-center gap-4 flex-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>Female</span>
              </label>
            </div>
          </div>
          <textarea
            name="coverLetter"
            placeholder="Cover Letter (Optional)"
            onChange={handleChange}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none resize-none min-h-[80px]"
          ></textarea>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setResume(e.target.files[0])}
              className="flex-1 border border-blue-200 rounded-lg p-2 bg-blue-50"
            />
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition-colors duration-200 px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-5 py-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* ✅ Error or Success Message Display */}
        {errorMsg && (
          <p className="text-red-600 mt-4 text-center font-semibold">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 mt-4 text-center font-semibold">{successMsg}</p>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
