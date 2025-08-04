
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://wms-website.onrender.com/api/admin/contact", { withCredentials: true })
      .then((res) => setMessages(res.data.messages))
      .catch((err) => console.log("Error fetching contacts", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl pt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-800 tracking-tight drop-shadow-lg">
            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent">Contact Messages</span>
          </h2>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-cyan-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Back
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-gray-500">No messages received yet.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {messages.map((msg) => (
              <div key={msg._id} className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 flex flex-col transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200 relative overflow-hidden group">
                <div className="absolute -top-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                  <svg width="80" height="80" fill="none" viewBox="0 0 80 80"><circle cx="40" cy="40" r="40" fill="#3B82F6" /></svg>
                </div>
                <p className="mb-1"><span className="font-semibold text-blue-700">Name:</span> {msg.fullName}</p>
                <p className="mb-1"><span className="font-semibold text-blue-700">Email:</span> <span className="text-blue-600">{msg.email}</span></p>
                <p className="mb-1"><span className="font-semibold text-blue-700">Number:</span> {msg.number}</p>
                <p className="mb-1"><span className="font-semibold text-blue-700">Subject:</span> {msg.subject}</p>
                <p className="mb-2"><span className="font-semibold text-blue-700">Message:</span> {msg.message}</p>
                <p className="text-xs text-gray-500 mt-auto">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
