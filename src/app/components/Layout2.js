import Header from '../components/Header';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children }) => {
    
  return (

    <div className="flex flex-col bg-cover bg-center">
        <Header />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
