import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.jpg'; // Adjust the path as necessary  
const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpire');
    navigate('/');
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-8 py-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-blue-800 tracking-tight">
          <div className="w-[45px] sm:w-[50px] md:w-[60px] lg:w-[70px] xl:w-[80px]">
                <img src={logo} alt="company name" className="w-full h-auto object-contain rounded-[50px]" />
               </div>
         
        </h1>

        <div className="flex gap-4 items-center">
          <Link
            to="/admin/application"
            className="text-blue-700 font-medium hover:underline text-sm sm:text-base"
          >
            Applications
          </Link>
          <Link
            to="/admin/contact"
            className="text-blue-700 font-medium hover:underline text-sm sm:text-base"
          >
            Contacts
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-4 py-2 text-sm sm:text-base transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
