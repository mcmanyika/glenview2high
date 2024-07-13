import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import Link from 'next/link'; // Import Link from next/link for client-side navigation

const Address = () => {
  return (
    <section className="p-4 bg-gray-400 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Our Address</h2>
            <p className="text-sm font-thin text-white font-sans">
              Address: 9480 1st Drive, <br />Glenview 3, <br /> PO Box GV 41, Glen View
            </p>
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-bold mb-2">Opportunities</h2>
            <p className="text-sm font-thin text-white font-sans">
              <Link href="/supplier">
                Suppliers Registration
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <h2 className="text-lg font-bold mb-2">Stay Connected</h2>
            <div className="flex space-x-2">
              <a
                href="https://www.facebook.com/groups/497811331424773/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebookSquare className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/your-instagram-page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;
