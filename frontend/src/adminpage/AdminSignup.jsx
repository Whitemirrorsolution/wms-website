
import axios from "axios";
import { useContext, useState } from "react";
import {useNavigate} from "react-router-dom"
import { adminDataContext } from "../context/AdminContext";
import { authDataContext } from "../context/AuthContext";

const AdminSignup = () => {

  const {serverUrl} = useContext(authDataContext)
  const{admnData, setAdminData} = useContext(adminDataContext)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const navigate = useNavigate()

    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name,
        email,
        password,
      }, {withCredentials:true})
      setAdminData(result.data)
      navigate("/admin/login")
       setErr("")
       setLoading(false)


      setName("")
      setEmail("")
      setPassword("")

    } catch (error) {
       console.log(error)
       setErr(error.response.data.message)
        setLoading(false)
      
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Admin Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter strong password"
            />
          </div>
           {err && <p className="text-center text-red-500">
          *{err}
          </p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p onClick={() => navigate("/admin/login")} className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
