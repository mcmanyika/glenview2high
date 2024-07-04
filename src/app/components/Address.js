import { FaFacebookSquare, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importing the icons from react-icons

const Address = () => {
  return (
    <section className="p-4 bg-gray-400 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold mb-2">Our Address</h2>
            <p className="text-sm text-white font-sans">
              Address: 9480 1st Drive, <br />Glenview 3, <br /> PO Box GV 41, Glen View
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <h2 className="text-lg font-bold mb-2">Stay Connected</h2>
            <div className="flex space-x-2">
              <a
                href="https://www.facebook.com/your-school-page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebookSquare className="h-6 w-6" />
              </a>
              <a
                href="https://www.twitter.com/your-twitter-page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/your-instagram-page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/your-linkedin-page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;
