import React from 'react';
import Header2 from '../components/Header2';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';

const Layout = ({ children, templateText }) => {
  return (
    <>
      <div className="flex flex-col bg-cover bg-center mb-10">
        <Header2 />
        <div className='w-full p-10 pt-28 md:p-20 md:pt-32 bg-slate-50 text-center text-3xl md:text-6xl'>
          {templateText ? templateText : ''} {/* Default text or passed prop */}
        </div>
        <main className="container mx-auto pt-10">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
