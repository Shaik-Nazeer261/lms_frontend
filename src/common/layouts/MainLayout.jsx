import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import MainHeader from "../components/headers/MainHeader";
import MainFooter from "../components/footers/MainFooter";

import StudentHeader from "../../student/components/StudentHeader";
// import InstructorHeader from "../../instructor/components/InstructorHeader";
// import AdminHeader from "../../admin/components/AdminHeader";
import '../../styles/scrollbar.css';

export default function MainLayout({ children }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const renderHeader = () => {
    if (role === "student") return <StudentHeader />;
    if (role === "instructor") return <InstructorHeader />;
    if (role === "admin") return <AdminHeader />;
    return <MainHeader />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {renderHeader()}
      <main className="flex-1 bg-gray-50">{children}</main>
      <MainFooter />
    </div>
  );
}
