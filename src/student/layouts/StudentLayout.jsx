import StudentHeader from "../components/StudentHeader";
import StudentFooter from "../components/StudentFooter";
import "../../styles/scrollbar.css";

export default function StudentLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen ">
      <StudentHeader />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
      <StudentFooter />
    </div>
  );
}
