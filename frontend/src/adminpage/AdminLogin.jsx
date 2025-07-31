import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", form);
      const token = res.data.token;
      const expireTime = new Date().getTime() + 5 * 60 * 60 * 1000; // 5 hrs
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminTokenExpire", expireTime);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-100 to-cyan-50 px-4">
      <div className="bg-white/80 backdrop-blur-lg border border-sky-100 shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-800 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
          Admin Login
        </h2>

        {error && (
          <p className="bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-2 mb-4 rounded-lg text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Admin Email"
            required
            className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 shadow-sm"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 shadow-sm"
          />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-800 transition-transform hover:scale-[1.02]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

