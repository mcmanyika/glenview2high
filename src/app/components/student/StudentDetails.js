import React from 'react';

const StudentDetails = ({ studentData }) => {
  return (
    <div className="bg-white border shadow-sm rounded p-5 m-2 mt-0 ml-0 mb-4">
      <div className="flex mb-2">
        <span className="font-semibold w-1/3">SCHOOL ID:</span>
        <span>{studentData.studentId}</span>
      </div>
      <div className="flex mb-2">
        <span className="font-semibold w-1/3">Email:</span>
        <span>{studentData.email}</span>
      </div>
      <div className="flex capitalize mb-2">
        <span className="font-semibold w-1/3">Grade Level:</span>
        <span>{studentData.gradeLevel}</span>
      </div>
      <div className="flex mb-2">
        <span className="font-semibold w-1/3">Class Name:</span>
        <span>{studentData.studentClass}</span>
      </div>
      <div className="flex mb-2">
        <span className="font-semibold w-1/3">Graduation Year:</span>
        <span>{studentData.graduationYear}</span>
      </div>
    </div>
  );
};

export default StudentDetails;
