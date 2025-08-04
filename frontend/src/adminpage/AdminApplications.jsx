import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://wms-website.onrender.com/api/admin/application", { withCredentials: true })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = applications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl pt-12 sm:pt-16">
        {/* Heading & Back */}
         <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-800 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">Job Applications</span>
          </h2>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-cyan-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Back
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex justify-center mb-6">
          <div className="h-1 w-24 bg-blue-400 rounded-full" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-xl border border-blue-100 bg-white">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold whitespace-nowrap">Candidate</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold whitespace-nowrap">Email</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold whitespace-nowrap">Number</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold whitespace-nowrap">Job Title</th>
                <th className="py-3 px-4 text-left text-blue-700 font-semibold whitespace-nowrap">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {currentItems.map((app) => (
                <tr key={app._id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">{app.fullName}</td>
                  <td className="py-3 px-4 text-blue-600 whitespace-nowrap">{app.email}</td>
                  <td className="py-3 px-4 text-blue-600 whitespace-nowrap">{app.phone}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{app.appliedJobTitle}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <a
                      href={`https://wms-website.onrender.com/uploads/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition duration-200 text-sm font-semibold"
                    >
                      View Resume
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {applications.length > itemsPerPage && (
          <div className="flex justify-center mt-6 space-x-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-200 text-blue-800 font-medium rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded font-medium ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-200 text-blue-800 font-medium rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;


