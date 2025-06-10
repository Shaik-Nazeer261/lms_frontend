import  { useEffect, useState } from 'react';
import {
  FaPlayCircle,
  FaClipboardCheck,
  FaUser,
  FaCalendarAlt,
  FaCreditCard
} from 'react-icons/fa';
import api from '../../api.jsx'; // <-- adjust path if needed
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    label: 'Enrolled Courses',
    value: 42,
    icon: <FaPlayCircle className="text-blue-600 text-xl" />,
    bg: 'bg-blue-100',
  },
  {
    label: 'Active Courses',
    value: 19,
    icon: <FaClipboardCheck className="text-indigo-600 text-xl" />,
    bg: 'bg-indigo-100',
  },
  {
    label: 'Students',
    value: 767,
    icon: <FaUser className="text-red-600 text-xl" />,
    bg: 'bg-red-100',
  },
  {
    label: 'Online Courses',
    value: 3,
    icon: <FaCalendarAlt className="text-green-600 text-xl" />,
    bg: 'bg-green-100',
  },
  {
    label: 'Total Earning',
    value: '₹25,000',
    icon: <FaCreditCard className="text-gray-800 text-xl" />,
    bg: 'bg-gray-100',
  },
];

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/profile/');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6 space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-[#F5F7FA] gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-lg shadow bg-white hover:shadow-md transition duration-300"
          >
            <div className={`p-3 rounded-md ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{stat.value}</h2>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Progress Card */}
      {profile && (
        <div className="flex items-center justify-between bg-[#111033] text-white p-4 rounded shadow-md">
          {/* Left: Avatar and Info */}
          <div className="flex items-center gap-4">
            <img
              src={profile.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}${profile.profile_picture}` : 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{profile.user.username}</p>
              <p className="text-sm text-gray-300">{profile.user.email}</p>
            </div>
          </div>

          {/* Middle: Progress Info */}
          <div className="flex-1 flex mx-14 gap-4 items-center justify-center">
            <div className="w-full h-3 bg-gray-700 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${profile.profile_completion}%` }}
              />
            </div>
            <p className="text-sm text-white font-medium whitespace-nowrap">
              {profile.profile_completion}% Completed
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/instructor/account-settings')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Biography
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
