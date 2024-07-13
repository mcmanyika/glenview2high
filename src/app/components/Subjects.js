import React from 'react';

const Subjects = () => {
  return (
    <>
    <div className='w-full p-4 text-3xl font-thin'> Subjects Offering</div>
    <div className="container mx-auto p-4 flex flex-col md:flex-row justify-center gap-4 md:gap-8">
        
      {/* 'A' LEVEL */}
      <div className="w-full md:w-1/3 bg-white rounded-lg border border-gray-300 shadow-md p-4">
        <h3 className="text-xl font-bold mb-2">A LEVEL</h3>
        <ul className="list-disc ml-4">
          <li>General Paper</li>
          <li>Literature in English</li>
          <li>Biblical studies</li>
          <li>History</li>
          <li>Art and Design</li>
          <li>Geography</li>
          <li>Accounting</li>
          <li>Business</li>
          <li>Economics</li>
          <li>Computer Science</li>
          <li>Design and Technology</li>
          <li>Agriculture (ZIMSEC)</li>
          <li>Mathematics</li>
          <li>Physical Education</li>
          <li>Biology</li>
          <li>Chemistry</li>
          <li>Physics</li>
        </ul>
      </div>

      {/* 'O' LEVEL */}
      <div className="w-full md:w-1/3 bg-white rounded-lg border border-gray-300 shadow-md p-4 mt-4 md:mt-0">
        <h3 className="text-xl font-bold mb-2">O LEVEL</h3>
        <ul className="list-disc ml-4">
          <li>English Language</li>
          <li>Literature in English</li>
          <li>Shona</li>
          <li>French</li>
          <li>Geography</li>
          <li>Maths</li>
          <li>Accounting</li>
          <li>Business studies</li>
          <li>Economics</li>
          <li>Computer Science</li>
          <li>ICT</li>
          <li>Physical Education</li>
          <li>Biology</li>
          <li>Chemistry</li>
          <li>Physical Science</li>
          <li>Art and Design / Agriculture / Design and Technology (choice of one practical subject)</li>
        </ul>
      </div>

      {/* FORM 1 & 2 */}
      <div className="w-full md:w-1/3 bg-white rounded-lg border border-gray-300 shadow-md p-4 mt-4 md:mt-0">
        <h3 className="text-xl font-bold mb-2">FORM 1 & 2</h3>
        <ul className="list-disc ml-4">
          <li>English Language</li>
          <li>Shona</li>
          <li>Maths</li>
          <li>Geography</li>
          <li>History</li>
          <li>Accounting</li>
          <li>Computer Science</li>
          <li>General Science</li>
          <li>Agriculture / Art and Design / Design and Technology / Physical Education (choice of one practical subject)</li>
          <li>Biology</li>
          <li>Chemistry</li>
          <li>Physics</li>
          <li>Physical Science</li>
          <li>Physical Education</li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default Subjects;
