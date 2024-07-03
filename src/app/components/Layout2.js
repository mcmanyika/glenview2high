import Header from '../components/Header';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';

import SessionProvider from "../SessionProvider";

const Layout2 = ({ children }) => {
    
  return (

    <SessionProvider>
    <div className="flex flex-col bg-cover bg-center">
        <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
    </SessionProvider>
  );
};

export default Layout2;
