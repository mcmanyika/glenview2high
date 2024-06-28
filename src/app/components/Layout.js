import Header from '../components/Header';
import Footer from '../components/Footer';
import Address from './Address';
import Hero from './Hero';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center">
      <Header />
      <Hero />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <Address />
      <Footer />
    </div>
  );
};

export default Layout;
