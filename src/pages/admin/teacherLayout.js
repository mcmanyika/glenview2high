import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import Breadcrumb from '../utils/Breadcrumb';
import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import '../../app/globals.css';
import AIAssistantForm from '../../app/components/ai/AIAssistantForm';
import Footer from '../../app/components/DashFooter';
import { database } from '../../../utils/firebaseConfig';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { FaTachometerAlt, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate, FaHome } from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';

const iconMapping = {
  FaTachometerAlt: FaTachometerAlt,
  FaPencilRuler: FaPencilRuler,
  FaCalendarAlt: FaCalendarAlt,
  FaClipboardList: FaClipboardList,
  FaUserGraduate: FaUserGraduate,
  MdOutlineLibraryBooks: MdOutlineLibraryBooks,
  LiaChalkboardTeacherSolid: LiaChalkboardTeacherSolid,
  IoPeopleOutline: IoPeopleOutline,
  RiAdminFill: RiAdminFill,
};

const AdminLayout = ({ children, studentStatus }) => {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [userType, setUserType] = useGlobalState('userType');
  const [schoolName, setSchoolName] = useGlobalState('schoolName');
  const [globalStudentId] = useGlobalState('studentId');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user?.email) {
        const studentIdRef = ref(database, `students/${globalStudentId}/studentId`);

        onValue(studentIdRef, (snapshot) => {
          const studentId = snapshot.val();

          if (studentId) {
            if (studentId.startsWith('STID')) {
              setUserType('student');
            } else if (studentId.startsWith('TEID')) {
              setUserType('teacher');
            } else {
              setUserType('unknown');
            }

            const schoolNameRef = ref(database, `students/${globalStudentId}/schoolName`);
            onValue(schoolNameRef, (snapshot) => {
              const schoolNameData = snapshot.val();
              setSchoolName(schoolNameData);
              setIsLoading(false);
            });
          } else {
            console.error('Student ID not found for user.');
            setUserType('unknown');
            setIsLoading(false);
          }
        });
      }
    };

    fetchUserDetails();
  }, [session, globalStudentId, setUserType, setSchoolName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleRef = ref(database, 'title');
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active'));

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
                category: data[key].category,
                icon: data[key].icon,
              }))
              .filter(a => a.category === 'dashboard' && a.status === 'Active');

            const filteredTitles = titlesArray.filter(title => {
              if (userType === 'student') {
                return !['Teachers', 'Class Routine', 'Notice', 'Events', 'Add Class', 'Admission'].includes(title.title);
              }
              return true;
            });
            setTitles(filteredTitles);
          } else {
            setTitles([]);
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();
  }, [userType]);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <div className="flex min-h-screen text-base bg-gray-100 relative">
      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 w-42 bg-blue-400 text-white p-4 min-h-screen rounded-tr-xl flex flex-col`}>
        <div className="flex justify-center items-center pt-10 mb-20">
          <Image src="/images/logo.png" alt="Logo" width={70} height={60} className='rounded-full' />
        </div>
        <nav className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>
          ) : (
            <ul className="flex flex-col h-full">
              {titles.length > 0 && titles.map((rw) => {
                const IconComponent = iconMapping[rw.icon];
                return (
                  <li key={rw.id} className="mb-4 flex flex-col items-center">
                    <Link href={rw.link} className="flex flex-col items-center">
                      <IconComponent className="text-2xl" />
                      <div className="text-center font-thin p-2 cursor-pointer w-full">{rw.title}</div>
                    </Link>
                  </li>
                );
              })}
              <li className="mb-4 flex flex-col items-center mt-auto">
                <FaSignOutAlt className="text-2xl" />
                <button
                  onClick={() => signOut()}
                  className="text-center font-thin p-2 hover:bg-blue-500 rounded cursor-pointer w-full"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          )}
        </nav>
      </aside>


      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-blue-400 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <Image src="/images/logo.png" alt="Logo" width={100} height={30} />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="w-full text-right p-2 border shadow-sm rounded-md flex items-center justify-end relative">
            {session && (
              <div className="flex items-center">
                <span className="text-sm mr-2">{session.user.name}</span>
                <div className="rounded-full overflow-hidden h-10 w-10 relative cursor-pointer" onClick={togglePopover}>
                  <Image src={session.user.image} alt="Profile" width={50} height={50} className="object-cover" />
                </div>
                {isPopoverOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
                    <Link href="/">
                      <div className="flex items-center text-sm text-left cursor-pointer hover:bg-gray-200 rounded p-2">
                        <FaHome className="mr-2" />
                        <span>Home</span>
                      </div>
                    </Link>
                    <button onClick={() => signOut()} className="mt-2 flex items-center w-full text-left p-2 hover:bg-gray-200 rounded text-sm text-blue-700">
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <Breadcrumb />
          {children}
        </main>
        <div className='p-4 md:p-6'>
          <Footer />
        </div>
        <AIAssistantForm />
      </div>
    </div>
  );
};

export default  withAuth(AdminLayout)