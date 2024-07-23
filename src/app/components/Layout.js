// components/Layout.js

import Header from '../components/Header';
import Footer from '../components/Footer';
import AIAssistantForm from '../components/ai/AIAssistantForm';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <AIAssistantForm />
    </>
  );
};

export default Layout;
