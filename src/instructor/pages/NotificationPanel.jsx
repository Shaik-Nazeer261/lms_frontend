import React, { useEffect, useState } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import api from '../../api'; // adjust this path to your API file
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();




  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/api/notifications/unread/');
        const grouped = groupMessagesBySender(res.data);
        setNotifications(grouped);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifs();
  }, []);

  const groupMessagesBySender = (messages) => {
    const grouped = {};

    messages.forEach((msg) => {
      if (!grouped[msg.sender]) {
        grouped[msg.sender] = {
          count: 0,
          messages: [],
          timestamp: msg.timestamp,
          profile_picture: msg.profile_picture, // ✅ ADD THIS LINE
        };
      }
      grouped[msg.sender].count += 1;
      grouped[msg.sender].messages.push(msg);
    });

    return Object.entries(grouped).map(([sender, data]) => ({
      sender,
      count: data.count,
      message: data.messages[0].message, // show the latest message
      timestamp: data.timestamp,
      profile_picture: data.profile_picture, // ✅ PASS IT TO RETURN
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#111827] mb-4 flex items-center gap-2">
        <FaBell className="text-blue-600" /> All Notifications
        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </h2>

      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <div
  key={index}
  className="flex items-start justify-between bg-white shadow-sm border p-4 rounded-md hover:shadow transition cursor-pointer"
  onClick={() =>
    navigate('/instructor/messages', {
      state: {
        username: notif.sender,
        profile_picture: notif.profile_picture,
      }
    })
  }
>
            {/* Left: Avatar & Message */}
            <div className="flex items-start gap-3">
              <img src={`${import.meta.env.VITE_BACKEND_URL}${notif.profile_picture}`}
                alt={notif.username}
                className="w-10 h-10 rounded-full object-cover"
                
                />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {notif.sender} sent {notif.count} message{notif.count > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-600 truncate max-w-xl">
                  {notif.message}
                </p>
              </div>
            </div>

            {/* Right: Time & Count */}
            <div className="flex flex-col items-end justify-between text-sm text-gray-500">
              <span>{moment(notif.timestamp).fromNow()}</span>
              <span className="text-xs mt-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                {notif.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
