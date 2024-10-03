import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai';
import AttritionData from './attritionchart'; // Attrition chart component
import ShrinkageData from './ShrinkageData';  // Import the new ShrinkageData component
import { BsFilter } from 'react-icons/bs';
import { FaGripHorizontal } from 'react-icons/fa';

const Home = () => {
  const [showChart, setShowChart] = useState(true); 
  const [yearFilter, setYearFilter] = useState(""); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order

  const availableYears = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];

  const handleFilterClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleYearSelect = (year) => {
    setYearFilter(year);
    setIsDropdownVisible(false);
  };

  const handleSortToggle = () => {
    setIsAscending((prev) => !prev); // Toggle sorting order
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center space-x-2 whitespace-nowrap">
          <FaGripHorizontal className="text-gray-600" />
          <span>Attrition Dashboard Prediction</span>
        </h1>

        <div className="flex justify-between items-center w-full space-x-4">
          <div className="flex items-center space-x-2 ml-auto mr-30">
            {/* Sort by button */}
            <button 
              className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300"
              onClick={handleSortToggle} // Add click handler
            >
              <BsFilter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800 font-bold">Sort by</span>
              <span className="bg-blue-200 text-blue-700 text-xs px-2 rounded-full">{isAscending ? '↑' : '↓'}</span>
            </button>

            {/* Filter by button */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300"
                onClick={handleFilterClick}
              >
                <AiOutlineFilter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800 font-bold">Filter by</span>
                <span className="bg-blue-200 text-blue-700 text-xs px-2 rounded-full">6</span>
              </button>

              {/* Year selection dropdown */}
              {isDropdownVisible && (
                <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                  {availableYears.map((year) => (
                    <li
                      key={year}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Search bar */}
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md px-3 py-2 w-80">
              <AiOutlineSearch className="h-5 w-5 text-gray-600" />
              <input
                type="text"
                placeholder="Search anything here..."
                className="outline-none text-gray-700 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-150px)] overflow-hidden">
        {/* Attrition Prediction Section */}
        <div className="bg-white p-6 shadow rounded h-full overflow-hidden">
          <h2 className="font-semibold text-lg">Attrition Prediction</h2>
          {showChart && <AttritionData selectedYear={yearFilter} isAscending={isAscending} />} {/* Pass sorting state */}
        </div>

        {/* Shrinkage Dashboard Section */}
        <div className="bg-white p-6 shadow rounded h-full overflow-hidden">
          <h2 className="font-semibold text-lg">Shrinkage Dashboard Prediction</h2>
          <ShrinkageData selectedYear={yearFilter} isAscending={isAscending} /> {/* Pass sorting state */}
        </div>
      </div>
    </div>
  );
};

export default Home;
