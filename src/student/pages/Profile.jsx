import React, { useState, useEffect } from "react";
import Profiledb from "../components/profiledb";
import ProfileCourses from "../components/ProfileCourses";
import Profileteachers from "../components/profileteachers";
import ProfileSettings from "../components/ProfileSettings";
import Wishlist from "../components/WishList";
import api from "../../api";
import ChatMessenger from "../components/ChatMessenger";
import PurchaseHistory from "../components/PurchaseHistory";
import QuizList from "../components/QuizList";
import QuizReport from "../components/QuizReport";

const tabs = [
  "Dashboard",
  // "Courses",
  "Teachers",
  "Message",
  "Quiz report",
  "Wishlist",
  "Purchase History",
  "Settings",
];



const Profile = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profile, setProfile] = useState({
    user: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
    headline: "",
    biography: "",
    website: "",
    social_links: {},
  });
  const [selectedCourseId, setSelectedCourseId] = useState(null); // ✅ track course

   useEffect(() => {
    api.get('/api/student/profile/')
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch profile', err);
      });
  }, []);

  return (
    <div className=" min-h-screen max-w-6xl mx-auto mt-10">
      <div className=" mx-auto px-6 py-6 bg-white  rounded-b">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/api${profile.profile_picture}`}
              alt="Profile"
              className="rounded-full w-16 h-16 object-cover"
            />
            <div>
              <h2 className="text-lg font-bold text-[#00113D]">{profile.user.first_name} {profile.user.last_name}</h2>
              <p className="text-sm text-gray-500">{profile.headline}</p>
            </div>
          </div>
          {/* <button className="bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-100">
            Become Instructor →
          </button> */}
        </div>

        {/* Tabs */}
        <div className="mt-4 flex justify-between  border-gray-200 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-3 ${
                activeTab === tab
                  ? "text-[#00113D] border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto ">
        {activeTab === "Dashboard" && (
          <Profiledb/>
        )}
        {/* {activeTab === "Courses" && (
          <ProfileCourses/>
        )} */}
        {activeTab === "Teachers" && (
          <Profileteachers/>
        )}
        {activeTab === "Message" && (
          <ChatMessenger/>
        )}
        {activeTab === "Quiz report" && (
          <div>
            {!selectedCourseId ? (
              <QuizList onSelectCourse={setSelectedCourseId} /> // ✅ show list
            ) : (
              <QuizReport courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)}/> // ✅ show report
            )}
          </div>
        )}
        {activeTab === "Wishlist" && (
          <Wishlist/>
        )}
        {activeTab === "Purchase History" && (
         <PurchaseHistory />
        )}
        {activeTab === "Settings" && (
         <ProfileSettings/>
        )}
      </div>
    </div>
  );
};

export default Profile;
