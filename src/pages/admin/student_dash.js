import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import withAuth from '../../../utils/withAuth';
import AdminLayout from './adminLayout';
import { FaSpinner, FaUser } from 'react-icons/fa';
import ClassRoutine from '../../app/components/student/ClassRoutine';
import { database } from '../../../utils/firebaseConfig';
import { ref, get, set } from 'firebase/database';
import { useRouter } from 'next/router';
import { useGlobalState, setStudentClass, setStatus } from '../../app/store';
import CombinedExamsList from '../../app/components/exams/CombinedExamsList';
import StudentAssignmentsList from '../../app/components/student/assignments/StudentAssignmentsList';
import StudentAttendanceHistory from '../../app/components/attendance/StudentAttendanceHistory';
import QuickStats from '../../app/components/student/stats/QuickStats';
import AcademicProgress from '../../app/components/student/stats/AcademicProgress';
import Deadlines from '../../app/components/student/stats/Deadlines';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import SubscriptionPlans from '../../app/components/student/subscription/SubscriptionPlans';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StudentDash = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [studentStatus, setGlobalStatus] = useGlobalState('status');
  const [studentId, setStudentId] = useGlobalState('studentId');
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      fetchStudentData(session.user.email);
    }
  }, [session, status]);

  const fetchStudentData = async (email) => {
    try {
      const studentRef = ref(database, 'userTypes');
      const studentSnapshot = await get(studentRef);

      if (studentSnapshot.exists()) {
        const allStudentData = studentSnapshot.val();
        const matchedStudent = Object.entries(allStudentData).find(([_, student]) => student.email === email);

        if (matchedStudent) {
          const [studentId, studentInfo] = matchedStudent;
          setStudentData(studentInfo);
          setStudentClass(studentInfo.class);
          setStudentId(studentId);
          localStorage.setItem('studentId', studentId);
          setGlobalStatus(studentInfo.status);
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        console.log('No student data found.');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching student data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscription = async (planType) => {
    try {
      const stripe = await stripePromise;
      
      // Create checkout session
      const response = await axios.post('/api/create-checkout-session', {
        studentId: studentId,
        studentEmail: session.user.email,
        planType: planType
      });

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditClick = async (e) => {
    e.preventDefault();
    try {
      // Fetch existing student details
      const studentDetailsRef = ref(database, `studentDetails/${studentId}`);
      const snapshot = await get(studentDetailsRef);
      
      if (snapshot.exists()) {
        setStudentDetails(snapshot.val());
      }
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to fetch student details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
      positionInFamily: e.target.positionInFamily.value,
      numberOfSiblings: e.target.numberOfSiblings.value,
      fatherName: e.target.fatherName.value,
      motherName: e.target.motherName.value,
      guardianName: e.target.guardianName.value,
      fatherOccupation: e.target.fatherOccupation.value,
      motherOccupation: e.target.motherOccupation.value,
      guardianOccupation: e.target.guardianOccupation.value,
      originInZimbabwe: e.target.originInZimbabwe.value,
      homeAddress: e.target.homeAddress.value,
      contactPerson: e.target.contactPerson.value,
      relation: e.target.relation.value,
      address: e.target.address.value,
      email: session.user.email,
      userID: studentData?.userID,
      class: studentData?.class,
      updatedAt: new Date().toISOString()
    };

    try {
      // Create a reference to the student details table
      const studentDetailsRef = ref(database, `studentDetails/${studentId}`);
      
      // Save the data
      await set(studentDetailsRef, formData);
      
      toast.success('Profile details saved successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to save profile details. Please try again.');
      console.error('Error saving profile details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-slate-950">
        <FaSpinner className="text-4xl text-main3 dark:text-main2 animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className='min-h-screen space-y-6 pt-6 dark:bg-slate-950 transition-colors duration-200'>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-main3/10 dark:bg-main2/10 rounded-full">
                <FaUser className="text-2xl text-main3 dark:text-main2" />
              </div>
                <div className='flex flex-col'>
                  <p className="text-gray-500 dark:text-gray-400">
                    Student ID: {studentData?.userID} <br />
                    Class: {studentData?.class}  <br />
                    <button onClick={handleEditClick} className="text-blue-500 hover:underline">Student Details</button>
                  </p>
                </div>
            </div>
          </div>
        </div>

       

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Class Routine</h3>
            </div>
            <div className="p-4">
              <ClassRoutine />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Attendance History</h3>
            </div>
            <div className="p-4">
              <StudentAttendanceHistory />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Assignments</h3>
            </div>
            <div className="p-4">
              <StudentAssignmentsList />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Exams Results</h3>
            </div>
            <div className="p-4">
                <AcademicProgress />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SubscriptionPlans />
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white border-b pb-2 dark:border-slate-700">
                {studentDetails ? 'Edit Student Details' : 'Add Student Details'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin in Zimbabwe</label>
                      <input
                        type="text"
                        name="originInZimbabwe"
                        defaultValue={studentDetails?.originInZimbabwe}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position in Family</label>
                      <input
                        type="number"
                        name="positionInFamily"
                        defaultValue={studentDetails?.positionInFamily}
                        min="1"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Siblings</label>
                      <input
                        type="number"
                        name="numberOfSiblings"
                        defaultValue={studentDetails?.numberOfSiblings}
                        min="0"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Parents/Guardian Information Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Parents/Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Father&apos;s Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        defaultValue={studentDetails?.fatherName}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mother&apos;s Name</label>
                      <input
                        type="text"
                        name="motherName"
                        defaultValue={studentDetails?.motherName}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guardian&apos;s Name</label>
                      <input
                        type="text"
                        name="guardianName"
                        defaultValue={studentDetails?.guardianName}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Father&apos;s Occupation</label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        defaultValue={studentDetails?.fatherOccupation}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mother&apos;s Occupation</label>
                      <input
                        type="text"
                        name="motherOccupation"
                        defaultValue={studentDetails?.motherOccupation}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guardian&apos;s Occupation</label>
                      <input
                        type="text"
                        name="guardianOccupation"
                        defaultValue={studentDetails?.guardianOccupation}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Address</label>
                      <textarea
                        name="homeAddress"
                        defaultValue={studentDetails?.homeAddress}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        rows="2"
                        required
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                        <input
                          type="text"
                          name="contactPerson"
                          defaultValue={studentDetails?.contactPerson}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relation</label>
                        <select
                          name="relation"
                          defaultValue={studentDetails?.relation}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                          required
                        >
                          <option value="">Select Relation</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Uncle">Uncle</option>
                          <option value="Aunt">Aunt</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Address</label>
                      <textarea
                        name="address"
                        defaultValue={studentDetails?.address}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-main3/50 focus:border-main3 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-colors duration-200"
                        rows="2"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-main3 rounded-md hover:bg-main3/90 dark:bg-main2 dark:hover:bg-main2/90 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default withAuth(StudentDash);
