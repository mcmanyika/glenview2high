import Header from '../components/Header';
import Footer from '../components/Footer';
import Address from './Address';
import Hero from './Hero';
import NewStudents from './NewStudents';
import About from './About';
import Socials from './Socials';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center">
      <Header />
      <Hero />

      <About />
      <Socials />
      <main className="flex-grow container mx-auto">
        {children}
      </main>
      <NewStudents />
      {/* <Address /> */}
      <Footer />
    </div>
  );
};

export default Layout;
