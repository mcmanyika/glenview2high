import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
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
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID] = useGlobalState('userID');
  const [logoUrl, setLogoUrl] = useState(''); // State for logo URL

  useEffect(() => {
    const fetchTitles = async () => {
      if (status === 'authenticated') {
        try {
          const titleRef = ref(database, `title`);
          const titleSnapshot = await get(titleRef);
          if (titleSnapshot.exists()) {
            const data = titleSnapshot.val();
            const titlesArray = Object.keys(data).map((key) => ({
              id: key,
              title: data[key].title,
              link: data[key].link,
              status: data[key].status,
              category: data[key].category,
              icon: data[key].icon,
            }));

            let filteredTitles = titlesArray.filter(title => title.category === 'dashboard');

            if (userID.startsWith('STFF')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Notice', 'Admission', 'Contact Us', 'Payments'].includes(title.title)
              );
            }

            if (userID.startsWith('ADM')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard'].includes(title.title)
              );
            }

            if (userID.startsWith('TCHR')) {
              filteredTitles = filteredTitles.filter(title =>
                ['Dashboard', 'Class Routine', 'Exams', 'Notice', 'Events', 'Add Class'].includes(title.title)
              );
            }

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
          setLogoUrl(accountData.logo); // Adjust key as needed
        } else {
          console.error('No account data found');
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchTitles();
    fetchLogo(); // Fetch the logo URL
  }, [session, status]);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex min-h-screen text-base bg-gray-100 relative">

      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 w-42 bg-main text-white p-4 min-h-screen rounded-tr-xl flex flex-col`}>
        <div className="flex justify-center items-center pt-10 mb-20">
        <Link href='/'>
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={70} height={60} className='rounded-full' />
          ) : (
            <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse" /> // Placeholder while loading
          )}
          </Link>
        </div>
        <nav className="flex-1"> 
          <TitleList titles={titles} onSignOut={handleSignOut} /> {/* Pass handleSignOut to TitleList */}
        </nav>
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-blue-400 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <Link href='/'>
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={100} height={30} />
            ) : (
              <div className="w-24 h-8 bg-gray-300 animate-pulse" /> // Placeholder while loading
            )}
            </Link>
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
