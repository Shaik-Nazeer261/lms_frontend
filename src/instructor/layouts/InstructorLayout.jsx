import React from "react";
import Sidebar from "../components/InstructorSidebar";
import Header from "../components/InstructorHeader";
import Footer from "../components/InstructorFooter";

const Layout = ({ children, title }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Panel */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header title={title} />

        {/* Scrollable Content */}
        <main className="flex-1 p-8 pt-24 overflow-y-auto mb-20">
          {children}
        </main>

        {/* Fixed Footer */}
        <div className="bottom-0 left-64 right-0 bg-white z-50">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
