import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaBars, FaTachometerAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../../app/globals.css';

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className="flex-1 flex flex-col md:ml-16 transition-all duration-300 ease-in-out">
        <header className="flex items-center bg-blue-400 text-white p-4 md:hidden">
          <FaBars className="cursor-pointer text-2xl" onClick={toggleMobileSidebar} />
          <h1 className="text-lg ml-4">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
