import Address from "./Address";

const Footer = () => {
    return (
      <footer className="bg-gray-400 text-white text-sm p-4">
        <Address />
        <div className="container mx-auto font-thin text-center">
          &copy; {new Date().getFullYear()} Website Developed by LEAPFROG, All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  