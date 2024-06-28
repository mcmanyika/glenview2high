// components/Footer.js
const Footer = () => {
    return (
      <footer className="bg-gray-400 text-white text-sm p-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Website Developed by LEAPFROG, All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  