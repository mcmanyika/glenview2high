import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaSignOutAlt, FaHome, FaCog } from 'react-icons/fa';
import Image from 'next/image';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';
import Breadcrumb from '../utils/Breadcrumb';
import '../../app/globals.css';

// Import all potential icons
import { FaTachometerAlt, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate } from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import Footer from '../../app/components/DashFooter';

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

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [titles, setTitles] = useState([]);

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
            setTitles(titlesArray);
          } else {
            setTitles([]);
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <div className="flex min-h-screen text-base bg-gray-100 relative">
      {/* Sidebar */}
      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 ${isExpanded ? 'w-52' : 'w-16'} bg-blue-400 text-white p-4 min-w-h-screen`}>
        <div className="flex justify-between items-center mb-6">
          {isExpanded && <h2 className="text-lg font-semibold">Glenview 2 High</h2>}
          <FaBars className="cursor-pointer text-2xl" onClick={toggleSidebar} />
        </div>
        <nav>
          <ul>
            {titles.length > 0 && titles.map((rw) => {
              const IconComponent = iconMapping[rw.icon];
              return (
                <li key={rw.id} className="mb-4 flex items-center">
                  <Link href={rw.link}>
                    <IconComponent className="mr-2 text-2xl" />
                  </Link>
                  {isExpanded && (
                    <Link href={rw.link}>
                      <div className="block p-2 hover:bg-blue-500 rounded cursor-pointer">{rw.title}</div>
                    </Link>
                  )}
                </li>
              );
            })}
            <li className="mb-4 flex items-center">
              <FaSignOutAlt className="mr-2 text-2xl" />
              {isExpanded && (
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left p-2 hover:bg-blue-500 rounded"
                >
                  Sign Out
                </button>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-blue-400 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <h1 className="text-lg">Glenview 2 High</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="w-full text-right p-2 border shadow-sm rounded-md flex items-center justify-end relative">
            {session && (
              <div className="flex items-center">
                <span className="text-sm mr-2">{session.user.name}</span>
                <div className="rounded-full overflow-hidden h-10 w-10 relative cursor-pointer" onClick={togglePopover}>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
                {isPopoverOpen && (
                  <div className="absolute right-0 mt-40 w-48 bg-white shadow-lg rounded-lg p-4">
                    <Link href="/">
                      <div className="flex items-center text-sm text-left cursor-pointer hover:bg-gray-200 rounded p-2">
                        <FaHome className="mr-2" />
                        <span>Home</span>
                      </div>
                    </Link>
                    <Link href="">
                      <div className="flex items-center text-sm text-left cursor-pointer hover:bg-gray-200 rounded p-2">
                        <FaCog className="mr-2" />
                        <span>Settings</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="mt-2 flex items-center w-full text-left p-2 hover:bg-gray-200 rounded text-sm text-blue-700"
                    >
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
        <div className='p-6'>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
