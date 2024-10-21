import Link from "next/link";
import Address from "./Address";

const Footer = () => {
    return (
      <footer className="bg-footer text-white text-sm p-4">
        <Address />
        <div className="container mx-auto font-thin text-center">
        &copy; Copyrights reserved {new Date().getFullYear()}. Developed by <Link href='https://smartlearner.vercel.app/' target="_blank"><b>LEAPFROG</b> 
        </Link>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  