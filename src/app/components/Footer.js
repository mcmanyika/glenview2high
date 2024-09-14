import Address from "./Address";

const Footer = () => {
    return (
      <footer className="bg-footer text-white text-sm p-4">
        <Address />
        <div className="container mx-auto font-thin text-center">
        &copy; Copyrights reserved {new Date().getFullYear()}. Developed by <b>LEAPFROG</b> 
        </div>
      </footer>
    );
  };
  
  export default Footer;
  