import { FaFacebookSquare } from 'react-icons/fa'; // Importing the Facebook icon from react-icons

const Address = () => {
  return (
    <section className="p-4 m-0 bg-gray-100  flex flex-col md:flex-row  items-start md:items-center">
        <div className=' container mx-auto'>
            <div className='flex justify-between'>
                <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-bold mb-2">Our Address</h2>
                    <p className="text-sm text-gray-700">
                    Address: 7700 S. Watson Road <br /> Arlington, TX 76002
                    </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                    <h2 className="text-lg font-bold mb-2">Stay Connected</h2>
                    <a 
                    href="https://www.facebook.com/your-school-page" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg text-gray-300 flex items-center space-x-2"
                    >
                    <FaFacebookSquare className="h-6 w-6" />
                    </a>
                </div>
            </div>
      </div>
    </section>
  );
};

export default Address;
