const AboutUsBanner = () => {
    return (
      <div className="relative w-full h-[500px] bg-gray-100 overflow-hidden">
        {/* Slanted Yellow Bar (Left) */}
        <div className="absolute top-0 left-0 w-20 h-full bg-yellow-500 transform -skew-x-12 -translate-x-10"></div>
  
        {/* Slanted Red Bar (Right) */}
        <div className="absolute top-0 right-0 w-20 h-full bg-red-600 transform -skew-x-12 translate-x-10"></div>
  
        {/* Content Area */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between px-8 md:px-16 h-full">
          {/* Left Section */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-10 text-gray-800 rounded-md shadow-lg relative">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">About US</h1>
            <p className="text-lg leading-relaxed">
              Divaris Makaharis High School is one of Zimbabwe’s reputable high schools, offering
              comprehensive Zimsec and Cambridge Examinations. The school is a cradle of academic
              excellence whose exit profile catches up with the signs of times.
            </p>
          </div>
  
          {/* Right Section */}
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-center relative">
            <div className="bg-gray-200 w-[300px] h-[300px] rounded-md shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-600">School Image</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutUsBanner;
  