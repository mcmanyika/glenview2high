import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaSignOutAlt, FaSpinner, FaHome } from 'react-icons/fa';
import Image from 'next/image';
import Breadcrumb from '../utils/Breadcrumb';
import { useGlobalState } from '../../app/store';
import withAuth from '../../../utils/withAuth';
import '../../app/globals.css';
import AIAssistantForm from '../../app/components/ai/AIAssistantForm';
import Footer from '../../app/components/DashFooter';
import { database } from '../../../utils/firebaseConfig';
import TitleList from '../../app/components/TitleList';
import { ref, get } from 'firebase/database';

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID] = useGlobalState('userID');

  useEffect(() => {
    const fetchTitles = async () => {
      if (status === 'authenticated') {
        try {
          // Fetch all titles from Firebase
          const titleRef = ref(database, `title`);
          const titleSnapshot = await get(titleRef);
          if (titleSnapshot.exists()) {
            const data = titleSnapshot.val();
            // Create an array of titles with the desired properties
            const titlesArray = Object.keys(data).map((key) => ({
              id: key,
              title: data[key].title,
              link: data[key].link,
              status: data[key].status,
              category: data[key].category,
              icon: data[key].icon,
            }));

            // Filter titles to only include those with category 'dashboard'
            let filteredTitles = titlesArray.filter(title => title.category === 'dashboard');

            // If userID starts with 'STFF', further filter titles
            if (userID.startsWith('STFF')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Notice', 'Events', 'Add Class', 'Admission', 'Class Routine', 'Payments'].includes(title.title)
              );
            }

            // If userID starts with 'ADM', further filter titles
            if (userID.startsWith('ADM')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard'].includes(title.title)
              );
            }

            // If userID starts with 'TCHR', further filter titles
            if (userID.startsWith('TCHR')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Class Routine', 'Exams', 'Notice', 'Events', 'Add Class'].includes(title.title)
              );
            }

            setTitles(filteredTitles); // Set filtered titles
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

    fetchTitles();
  }, [session, status]);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen text-base bg-gray-100 relative">
      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 w-42 bg-main text-white p-4 min-h-screen rounded-tr-xl flex flex-col`}>
        <div className="flex justify-center items-center pt-10 mb-20">
          <Image src="/images/logo.png" alt="Logo" width={70} height={60} className='rounded-full' />
        </div>
        <nav className="flex-1"> 
            <TitleList titles={titles} onSignOut={() => signOut()} />
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
                <div className="rounded-full overflow-hidden h-10 w-10 relative">
                  <Image src={session.user.image} alt="Profile" width={50} height={50} className="object-cover" />
                </div>
              </div>
            )}
          </div>
          <div className=''>
            <Breadcrumb />
            {children}
          </div>
        </main>
        <Footer />
        <AIAssistantForm />
      </div>
    </div>
  );
};

export default withAuth(AdminLayout);
