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

const TeacherDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full">
        <GenderCount /> 
          <div className="w-full flex mt-4">
            <div className="bg-white flex-1 border shadow-sm rounded mr-1 p-4 relative">
              <div className="absolute top-2 right-2">
                <Link href="/admin/exams">
                  <div className="three-dots flex flex-col items-center space-y-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                  </div>
                </Link>
              </div>
              <StatusPieChart />
            </div>
            <div className="bg-white flex-1 border shadow-sm rounded ml-1 p-4 relative">
              <div className="absolute top-2 right-2">
                <Link href="/admin/exams">
                  <div className="three-dots flex flex-col items-center space-y-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                  </div>
                </Link>
              </div>
              <CompletedExamsPassRatePieChart />
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
