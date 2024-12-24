'use client'
import { useNavigation } from '../hooks/useNavigation';
import Login from '../pages/admin/login';

// Navigation component with links
const Navigation = ({ navigateTo }) => {
  return (
    <nav className="bg-white shadow-lg mb-4">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 h-16 items-center">
          <button 
            onClick={() => navigateTo(<Login />)}
            className="text-gray-600 hover:text-blue-600"
          >
            Login
          </button>
          
        </div>
      </div>
    </nav>
  );
};

// Main App component
export default function Home() {
  const { currentComponent, navigateTo } = useNavigation(<Login />);

  return (
    <div>
      <Navigation navigateTo={navigateTo} />
      <main className="container mx-auto px-4">
        {currentComponent}
      </main>
    </div>
  );
}
