import Sidebar from '../components/InstructorSidebar.jsx';
import Header from '../components/InstructorHeader.jsx';
import Footer from '../components/InstructorFooter.jsx';

const Layout = ({ children, title }) => {
  return (
    <div className="flex">
      <Sidebar />
      
      {/* Right Panel */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen px-10">
        <Header title={title} />
        
        {/* Main content grows to fill space */}
        <main className="flex-1 p-8 pt-24 overflow-auto">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
