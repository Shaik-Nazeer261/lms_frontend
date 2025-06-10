import  { useEffect, useState } from 'react';
import { FiSearch, } from 'react-icons/fi';
import api from '../../api.jsx';
import Bell1 from '../../icons/Bell1.svg'; // Adjust the path as necessary
import Bell from '../../icons/Bell.svg'; // Adjust the path as necessary

const Header = ({ title }) => {


  const [instructor, setInstructor] = useState(null);
   const [notifications, setNotifications] = useState([]);

    useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/api/notifications/unread/');
        const grouped =res.data;
        setNotifications(grouped);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifs();
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile/'); // ⬅️ Adjust endpoint as needed
        setInstructor(res.data);
        // console.log(`${import.meta.env.VITE_BACKEND_URL}${res.data.profile_picture}`)
      } catch (err) {
        console.error('Failed to fetch instructor profile', err);
      }
    };

    fetchProfile();
  }, []);

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
          <a href="/instructor/notifications" className="flex items-center">
           <img
  src={notifications.length === 0 ? Bell : Bell1}
  alt="Notifications"
  className="w-5 h-5 ml-2"
/>

          </a>
        </div>

        {/* Avatar */}
        {instructor?.profile_picture ? (
 <img
  src={`${import.meta.env.VITE_BACKEND_URL}${instructor.profile_picture}`}
  alt={instructor.user?.username || "Instructor"}
  className="w-9 h-9 rounded-full object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/36"; // fallback image
  }}
/>

) : (
  <div className="w-9 h-9 rounded-full bg-gray-300" />
)}

      </div>
    </header>
  );
};

export default Header;
