import Header2 from '../components/Header2';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css'


const Layout = ({ children }) => {
    
  return (

    <div className="flex flex-col bg-cover bg-center">
      <Header2 />
      <main className="flex-grow container mx-auto pt-32">
        {children}
      </main>
    </div>
  );
};

export default Layout;
