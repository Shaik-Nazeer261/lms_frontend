import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/AdminSidebar';
import Header from '../components/AdminHeader';
import Footer from '../components/AdminFooter';

const AdminLayout = ({ title = "Admin Panel" }) => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-50">
        <Header title={title} />

        {/* Render nested route content here */}
          <main className=" flex-1  pt-24 overflow-y-auto " style={{width:"1190px"}}>
          <Outlet />
          </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
