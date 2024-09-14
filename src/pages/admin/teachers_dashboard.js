import { useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import GenderCount from '../../app/components/teachers/utils/GenderCount';
import Students from '../../app/components/teachers/utils/Students';
import TeacherCounts from '../../app/components/notice/TeacherCounts';
import StatusPieChart from '../../app/components/exams/StatusPieChart';
import CompletedExamsPassRatePieChart from '../../app/components/exams/CompletedExamsPassRatePieChart';
import Link from 'next/link';
import StudentGenderCount from '../../app/components/teachers/utils/StudentGenderCount';
import ExamResults from '../../app/components/exams/ExamResults';

const TeacherDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
          <StudentGenderCount />
          <div className="w-full flex mt-4">
            <div className="bg-white flex-1 border shadow-sm rounded ml-1 p-4 relative">
              <ExamResults />
            </div>
          </div>
          <div className="bg-white border shadow-sm rounded mt-4 p-4">
            <Students />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);
