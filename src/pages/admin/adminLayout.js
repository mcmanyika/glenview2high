import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaUser, FaUpload, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import Breadcrumb from '../utils/Breadcrumb';
import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import '../../app/globals.css';

import { useRouter } from 'next/router';

import Footer from '../../app/components/DashFooter';
import { database } from '../../../utils/firebaseConfig';
import TitleList from '../../app/components/TitleList';
import DocUploads from '../../app/components/admin/uploads/DocUploads';
import { ref, get } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoticeCount from '../../app/components/notice/NoticeCount';
import { useTheme } from 'next-themes';

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useGlobalState('userID');
  const [logoUrl, setLogoUrl] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userType, setUserType] = useState(null); // State for user type
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const router = useRouter(); // Router for navigation

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef(null); // Add this ref for the popup

  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserType = async () => {
        try {
          const userEmail = session.user.email; // Get the user's email from session
          const userRef = ref(database, 'userTypes'); // Reference to the userTypes node in Firebase
          const snapshot = await get(userRef); // Get the data from Firebase

          if (snapshot.exists()) {
            const users = snapshot.val(); // Get the user data
            const foundUserID = Object.keys(users).find(id => users[id].email === userEmail); // Find user by email

            if (foundUserID) {
              const userData = users[foundUserID];
              setUserType(userData.userType); // Set user type
              setUserID(foundUserID); // Store user ID in the state
            } else {
              console.log('No user found with this email.');
              router.push('/admin/user'); // Redirect if no user is found
            }
          } else {
            console.log('No user types found.');
          }
        } catch (error) {
          console.error('Error fetching user type:', error); // Log any error
          setError('Error fetching user type. Please try again later.'); // Set error message
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchUserType();
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchTitles = async () => {
      if (status === 'authenticated') {
        try {
          const titleRef = ref(database, `title`);
          const titleSnapshot = await get(titleRef);
          if (titleSnapshot.exists()) {
            const data = titleSnapshot.val();
            
            // Define allowed titles based on userID
            const allowedTitles = {
              'STFF': ['Dashboard', 'Class Routine', 'Notice', 'Admissions', 'Applicants', 'Attendance', 'Payment', 'Class Allocation'],
              'ADM': ['Dashboard', 'Finance', 'My Assignments', 'Term Reports', 'Store'],
              'TCHR': ['Dashboard', 'Assignments', 'Attendance', 'Students Stats', 'Student Report', 'Exams', 'Notice', 'Events']
            };

            // Get the correct set of allowed titles based on userID prefix
            let userAllowedTitles = [];
            if (userID.startsWith('STFF')) userAllowedTitles = allowedTitles['STFF'];
            else if (userID.startsWith('ADM')) userAllowedTitles = allowedTitles['ADM'];
            else if (userID.startsWith('TCHR')) userAllowedTitles = allowedTitles['TCHR'];

            // Filter while mapping
            const filteredTitles = Object.keys(data)
              .reduce((acc, key) => {
                const item = data[key];
                if (
                  item.category === 'dashboard' && 
                  userAllowedTitles.includes(item.title)
                ) {
                  acc.push({
                    id: key,
                    title: item.title,
                    link: item.link,
                    status: item.status,
                    category: item.category,
                    icon: item.icon,
                  });
                }
                return acc;
              }, []);

            setTitles(filteredTitles);
          } else {
            console.error('No titles found');
          }
        } catch (error) {
          console.error('Error fetching titles:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchLogo = async () => {
      try {
        const accountRef = ref(database, `account`);
        const accountSnapshot = await get(accountRef);
        if (accountSnapshot.exists()) {
          const accountData = accountSnapshot.val();
          setLogoUrl(accountData.logo);
          setWebsiteUrl(accountData.website);
        } else {
          console.error('No account data found');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchTitles();
    fetchLogo();
  }, [session, status, userID]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsPopupVisible(false);
  };

  const handleSignOut = () => {
    signOut();
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div className="flex min-h-screen overflow-y-auto text-base bg-main dark:bg-gray-900">
      <aside 
        className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-all duration-300 md:relative md:translate-x-0 
          ${isExpanded ? 'w-64' : 'w-16'} 
          bg-dash dark:bg-gray-800 text-white p-2 min-h-screen overflow-y-auto rounded-tr-xl 
          flex flex-col`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className={`flex ${isExpanded ? 'justify-center' : 'justify-center'} items-center`}>
          <Link href={websiteUrl || '#'}>
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt="Logo" 
                width={isExpanded ? 70 : 55} 
                height={isExpanded ? 60 : 55} 
                className='rounded-full transition-all duration-300 m-2 mb-8' 
              />
            ) : (
              <div className={`${isExpanded ? 'w-14 h-14' : 'w-11 h-11'} bg-gray-300 rounded-full animate-pulse`} />
            )}
          </Link>
        </div>
        <nav className="flex-1 h-screen overflow-y-auto px-1">
          <TitleList 
            titles={titles} 
            onSignOut={handleSignOut}
            isExpanded={isExpanded}
            iconSize="text-2xl"
          />
        </nav>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${isExpanded ? 'md:ml-2' : 'md:ml-4'}`}>
        <header className="flex items-center justify-between bg-dash dark:bg-gray-800 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <Link href={websiteUrl || '#'}>
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={50} height={30} className='rounded-full' />
              ) : (
                <div className="w-24 h-8 bg-gray-300 animate-pulse" />
              )}
            </Link>
          </div>
        </header>
        <main className="bg-gray-100 dark:bg-gray-900 p-4">
          <div className="w-full p-2 border shadow-sm rounded-md dark:bg-gray-800 dark:border-gray-700">
            {session && (
              <div id="profile" className="flex justify-end">
                <div className="flex items-center">
                  <div className="text-sm mr-2 cursor-pointer" onClick={togglePopup}>
                    <span className="dark:text-white">{session.user.name}</span>
                  </div>
                  <div
                    className="rounded-full mr-4 overflow-hidden relative cursor-pointer"
                    onClick={togglePopup}
                  >
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={35}
                      height={35}
                      className="object-cover"
                    />
                  </div>
                  <NoticeCount />
                </div>
              </div>
            )}
            {isPopupVisible && (
              <div 
                ref={popupRef}
                className="absolute text-left top-20 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4"
              >
                <Link href='/admin/profile'>
                  <span className="flex items-center p-2 text-gray-500 dark:text-gray-300">
                    <FaUser className="mr-2" /> My Profile
                  </span>
                </Link>
                
                <span
                  className="flex items-center p-2 text-gray-500 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaUpload className="mr-2" /> Documents Uploads
                </span>
                <span
                  className="flex items-center p-2 text-gray-500 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="mr-2" /> Log Out
                </span>
              </div>
            )}
          </div>
          <div>
            <Breadcrumb />
            <div className='h-screen mt-6  overflow-y-auto'>
              {children}
            </div>
          </div>
        </main>

        <Footer />

        {/* Modal for Document Upload */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <DocUploads closeModal={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
