import { useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './teacherLayout';
import Students from '../../app/components/teachers/utils/Students';
import TeacherCounts from '../../app/components/notice/TeacherCounts';

const TeacherDashboard = () => {

  return (
    <AdminLayout>
      <div className="flex flex-col">
        <div className="w-full px-2">
          <TeacherCounts />
          <div className="w-full flex flex-col mt-4">
            <div className="bg-white border shadow-sm rounded m-2 p-4">
              <Students />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(TeacherDashboard);

