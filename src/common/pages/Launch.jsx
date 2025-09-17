import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import launch from '../images/launch.png'; // Replace with your 3D image
import lmslogo from '../../icons/lmslogo.svg'; // Replace with your logo

const Launch = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-07-01") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen items-center max-w-6xl bg-white font-sans mx-auto">
      {/* Header */}
      <header className="flex  items-center mx-24 py-4 justify-between border-blue-200 ">
        <div className="flex items-center space-x-2">
          <img src={lmslogo} alt="Logo"  />
         
        </div>
        <div className="flex space-x-4 text-gray-700">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaYoutube /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col-reverse md:flex-row  justify-center   space-y-12 md:space-y-0 md:space-x-16">
        {/* Left Section */}
        <div className="max-w-sm text-center md:text-left my-auto">
          <p className="text-blue-600 font-semibold mb-2 uppercase">Coming Soon</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            We are going to launch our website very soon. Stay tune
          </h2>

          {/* Countdown Timer */}
          <div className="flex justify-center md:justify-start gap-4 mb-8">
            {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded text-center w-20">
                <p className="text-xl font-bold">
                  {timeLeft[unit] < 10 ? `0${timeLeft[unit]}` : timeLeft[unit]}
                </p>
                <span className="text-sm text-gray-600 capitalize">{unit}</span>
              </div>
            ))}
          </div>

          {/* Email Notify Form */}
          
        </div>

        {/* Right Section: Image */}
        <div className="relative">
  <img
    src={launch} // Replace with your 3D image
    alt="Illustration"
    className="w-full max-w-md mx-auto md:max-w-lg"
  />

  {/* Notification Box - overlapping using absolute + positioning */}
  <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 bg-white shadow-lg p-6 rounded max-w-md w-full">
    <h3 className="text-lg font-semibold mb-2">Get notified when we launch</h3>
    <div className="flex items-center border border-[#E9EAF0] rounded overflow-hidden">
      <input
        type="email"
        placeholder="Email address"
        className="w-sm  px-3  mr-2 py-2 border-none focus:outline-none "
      />
      <button className="bg-blue-500 text-white px-4 py-2 whitespace-nowrap">Notify Me</button>
    </div>
    <p className="text-xs text-gray-500 mt-2">*Don't worry we will not spam you 😊</p>
  </div>
</div>

      </main>
    </div>
  );
};

export default Launch;
