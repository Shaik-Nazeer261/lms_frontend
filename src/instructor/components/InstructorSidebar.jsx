import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import logo from '../../icons/wlogo.svg';
import ChartBar from '../../icons/ChartBar.svg';
import PlusCircle from '../../icons/PlusCircle.svg';
import Stack from '../../icons/wstack.svg';
import CreditCard from '../../icons/CreditCard.svg';
import ChatCircleDots from '../../icons/ChatCircleDots.svg';
import Gear from '../../icons/Gear.svg';


const handleLogout = () => {
 localStorage.clear();
  window.location.href = '/'; // Redirect to login page
};


const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-[#001744] text-white flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="flex flex-col items-center py-6">
          <img src={logo} alt="Logo" className=" w-32 mb-2" />
          
        </div>
        <nav className="px-5 space-y-2">
          <NavLink to="/instructor/dashboard" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={ChartBar}/> Dashboard
          </NavLink>
          <NavLink to="/instructor/create_course" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={PlusCircle}/>  Create New Course
          </NavLink>
          <NavLink to="/instructor/my_courses" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={Stack}/>  My Courses
          </NavLink>
          <NavLink to="/earning" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={CreditCard}/>  Earning
          </NavLink>
          <NavLink to="/instructor/messages" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 relative ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={ChatCircleDots}/>  Message
            
          </NavLink>
          <NavLink to="/instructor/account-settings" className={({ isActive }) => `flex items-center px-3 py-2 rounded gap-4 ${isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white hover:bg-blue-600'}`}>
            <img src={Gear}/>  Settings
          </NavLink>
        </nav>
      </div>
      <div
        className="px-4 py-4 bg-[#24375b] flex items-center text-gray-300 text-sm cursor-pointer hover:text-white hover:bg-red-500"
        onClick={handleLogout}
      >
        <FiLogOut className="mr-3" /> Sign-out
      </div>
    </aside>
  );
};

export default Sidebar;
