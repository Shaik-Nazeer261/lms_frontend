import { FiSearch, FiBell } from 'react-icons/fi';

const Header = ({ title }) => {
  return (
<header className="fixed top-0 left-64 right-0 z-50 bg-white border-b shadow-sm px-8 py-6 flex items-center justify-between">
      {/* Left: Greeting & Title */}
      <div>
        <h2 className="text-sm text-gray-500">Good Morning</h2>
        <h1 className="text-lg font-semibold text-[#00113D]">{title}</h1>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center bg-[#F6F9FC] px-3 py-2 rounded-md">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm text-gray-600 placeholder:text-gray-400 w-40"
          />
        </div>

        {/* Notification */}
        <div className="bg-[#F6F9FC] p-2 rounded-md cursor-pointer">
          <FiBell className="text-[#00113D]" />
        </div>

        {/* Avatar */}
        <img
          src="/profile.jpg" // Replace with actual image path
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
