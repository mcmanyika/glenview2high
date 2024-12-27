import React from 'react';
import StatusBadge from './StatusBadge';

const StudentTable = ({ filteredStudents, paymentStatus, onStudentClick }) => (
  <div className="overflow-hidden rounded-xl border border-gray-200">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>         
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredStudents.map((student) => (
          <tr 
            key={student.id}
            onClick={() => onStudentClick(student)}
            className="hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.userID}</td>
            <td className="py-4 px-6 text-sm text-gray-500">{student.name}</td>
            <td className="py-4 px-6 text-sm text-gray-500">{student.class}</td>
            <td><button className="bg-green-500 text-white px-4 py-1 text-sm  rounded-full">Make Payment</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentTable; 