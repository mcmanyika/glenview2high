import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaTachometerAlt, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import Image from 'next/image';
import '../../app/globals.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <aside className={`fixed z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 ${isExpanded ? 'w-64' : 'w-16'} bg-blue-400 text-white p-4 h-screen`}>
        <div className="flex justify-between items-center mb-6">
          {isExpanded && <h2 className="text-xl font-semibold">Admin Dashboard</h2>}
          <FaBars className="cursor-pointer text-2xl" onClick={toggleSidebar} />
        </div>
        <nav>
          <ul>
            <li className="mb-4 flex items-center">
              <FaTachometerAlt className="mr-2 text-2xl" />
              {isExpanded && (
                <Link href="/admin/dashboard">
                  <div className="block p-2 hover:bg-blue-500 rounded cursor-pointer">Dashboard</div>
                </Link>
              )}
            </li>
            <li className="mb-4 flex items-center">
              <FaCog className="mr-2 text-2xl" />
              {isExpanded && (
                <Link href="/admin/settings">
                  <div className="block p-2 hover:bg-blue-500 rounded cursor-pointer">Settings</div>
                </Link>
              )}
            </li>
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
      <div className="flex-1 flex flex-col  transition-all duration-300 ease-in-out">
        <header className="flex items-center justify-between bg-blue-400 text-white p-4 md:hidden">
          <div className="flex items-center">
            <FaBars className="cursor-pointer text-2xl mr-4" onClick={toggleMobileSidebar} />
            <h1 className="text-lg">Admin Dashboard</h1>
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
                    <Link href="/admin/settings">
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
          {children}
        </main>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AdminLayout;
