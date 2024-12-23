import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <div className="w-full mb-6">
    <div className="relative">
      <input
        type="text"
        placeholder="Search by student name or ID..."
        value={value}
        onChange={onChange}
        className="p-3 pl-10 border border-gray-200 rounded-xl w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg 
        className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
);

export default SearchBar; 