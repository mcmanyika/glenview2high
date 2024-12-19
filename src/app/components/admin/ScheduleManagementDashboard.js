import React from "react";
import RoutineList from "../admin/RoutineList";
import ClassRoutineForm from '../../../app/components/student/ClassRoutineForm'

const ScheduleManagementDashboard = () => {
  
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Schedule Management</h1>
      <div className='w-full bg-white dark:bg-slate-900 flex flex-col lg:flex-row'>
        <div className='w-full lg:w-1/4 m-3 ml-0'>
          <ClassRoutineForm />
        </div>
        <div className='w-full lg:w-3/4 m-3 lg:ml-0 lg:mt-0'>
          <RoutineList />
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagementDashboard;
