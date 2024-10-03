import React from 'react';
import { FaBell } from 'react-icons/fa';

const TopBar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Left: Logo and Title */}
      <div className="flex items-center">
        <img src="/logo.jpg" alt="Logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold ml-2">datanitiv</h1>
        <span className="text-sm bg-orange-100 text-orange-600 rounded-full ml-2 px-2 py-0.5">Pro</span>
      </div>

      {/* Right: Notification and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon in a square box with rounded edges */}
        <div className="relative p-2 bg-gray-200 rounded-lg cursor-pointer"> {/* Change rounded-full to rounded-lg */}
          <FaBell className="text-xl text-gray-500" />
          <span className="absolute top-0 right-0 bg-pink-500 h-2 w-2 rounded-full"></span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2">
          <img
            src="/profile-picture.jpg"
            alt="User"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-gray-600 font-semibold">Mohit Shah</span>
          
        </div>
      </div>
    </header>
  );
};

export default TopBar;
