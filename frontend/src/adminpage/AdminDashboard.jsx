import React from 'react';
import AdminHeader from '../adminpage/AdminHeader';
import JobPostForm from './JobPostForm';

const AdminDashboard = () => {
  return (
    <div className="w-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-24 px-4 sm:px-8 flex flex-col items-center min-h-screen">
      <AdminHeader />

      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <JobPostForm />
        </div>
        <div>
          {/* JobList or other content */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

