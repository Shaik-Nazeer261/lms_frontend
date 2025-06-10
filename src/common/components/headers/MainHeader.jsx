import React, { useEffect, useState } from "react";
import logo from "../../../icons/logo.svg";
import search from "../../../icons/search.svg";
import bell from "../../../icons/bell.svg";
import heart from "../../../icons/heart.svg";
import cart from "../../../icons/cart.svg";
import caretdown from "../../../icons/caretdown.svg";
import User from "../../../icons/User.svg";
import { Link, NavLink } from "react-router-dom";
import api from "../../../api"; // Adjust path if needed
import lmslogo from "../../../icons/lmslogo.svg";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
  const access = localStorage.getItem("access");
  const userMeta = localStorage.getItem("user");

  if (access && userMeta) {
    const parsedUser = JSON.parse(userMeta);
    setUser(parsedUser);

    const role = parsedUser.role;
    const endpoint =
      role === "student" ? "/api/student/profile/" : "/api/profile/";

    api
      .get(endpoint)
      .then((res) => {
        if (res.data.profile_picture) {
          setProfileImage(`${import.meta.env.VITE_BACKEND_URL}${res.data.profile_picture}`);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile image", err);
      });
  }
}, []);


  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full border border-gray-300 border-t-0">
      {/* Top Nav */}
      <nav className="bg-[#00113D] text-white py-3">
        <ul className="flex justify-center space-x-10 text-sm font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-t-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white hover:border-t-2 hover:border-blue-400 pb-1"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-t-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white hover:border-t-2 hover:border-blue-400 pb-1"
              }
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-t-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white hover:border-t-2 hover:border-blue-400 pb-1"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-t-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white hover:border-t-2 hover:border-blue-400 pb-1"
              }
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/become-instructor"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-t-2 border-blue-400 pb-1"
                  : "text-gray-300 hover:text-white hover:border-t-2 hover:border-blue-400 pb-1"
              }
            >
              Become an Instructor
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom Nav */}
      <nav className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between shadow-sm">
        {/* Center: Logo + Search */}
        <div className="flex space-x-4">
          <div>
            <a href='/admin/login' ><img src={lmslogo} alt="Logo" className="w-[8rem]" /></a>
          </div>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-600 cursor-pointer h-10">
            <span className="mr-11">Browse</span>
            <img src={caretdown} alt="dropdown" className="w-4 h-4 mr-2" />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 w-full h-10">
           <img
              src={search}
              alt="search"
              className="w-4 h-4 text-gray-400 mr-2"
            /> 
            <input
              type="text"
              placeholder="What do you want learn..."
              className="outline-none text-sm text-gray-700 bg-transparent "
            />
          
          </div>
          

        </div>

        {/* Right: Icons + User */}
        <div className="flex items-center space-x-4">
           
  <div className=" items-center font-semibold whitespace-nowrap">
    <Link to="/instructor/login" className="ml-4 flex items-center">
    Teach on GALMS
    </Link>
  </div>

          {/* <img src={bell} alt="bell" className="h-5 w-5 cursor-pointer" /> */}
          {/* <img src={heart} alt="wishlist" className="h-5 w-5 cursor-pointer" /> */}
          {user?.role === "student" && (
  <Link to="/student/cart">
    <img src={cart} alt="cart" className="h-5 w-5 cursor-pointer" />
  </Link>
)}


          {user ? (
            <div className="relative">
              <img
  src={profileImage || User}
  alt="User"
  className="w-9 h-9 rounded-full object-cover border cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  }}
/>


              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
                  {user.role === "student" && (
                    <Link
                      to="/student/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/"; // or use navigate('/')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="bg-blue-50 text-blue-600 text-sm px-4 py-1.5 hover:bg-blue-100">
                <a href="/student/signup">Create Account</a>
              </button>
              <button className="bg-blue-500 text-white text-sm px-4 py-1.5 hover:bg-blue-600">
                <a href="/student/login">Sign In</a>
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
