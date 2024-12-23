import React from "react";
import RoutineList from "../admin/RoutineList";
import ClassRoutineForm from '../../../app/components/student/ClassRoutineForm'

const ScheduleManagementDashboard = () => {
  
  return (
      <div className='w-full bg-white dark:bg-slate-900 flex flex-col lg:flex-row'>
        <div className='w-full lg:w-2/5 m-3 ml-0'>
          <ClassRoutineForm />
        </div>
        <div className='w-full lg:w-3/5 m-3 lg:ml-0 lg:mt-0'>
          <RoutineList />
        </div>
    </div>
  );
};

export default ScheduleManagementDashboard;
