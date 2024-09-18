import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { FaFacebookSquare } from 'react-icons/fa';
import ItemList from '../components/ItemsList';
import { database } from '../../../utils/firebaseConfig'; // Adjust the path to your firebaseConfig file

const Address = () => {
  const [address, setAddress] = useState('Loading...');

  // Fetch address from the account table
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const snapshot = await get(ref(database, 'account')); // Adjust this path according to your structure
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAddress(data.address || 'Address not found'); // Adjust based on your data structure
        } else {
          setAddress('No address available');
        }
      } catch (error) {
        console.error('Error fetching address: ', error);
        setAddress('Failed to load address');
      }
    };

    fetchAddress();
  }, []);

  return (
    <section className="p-4 bg-footer text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="pb-5 w-52">
            <h2 className="text-sm font-bold mb-2 uppercase">Our Address</h2>
            <p className="text-sm font-thin text-white font-sans">
              {address}
            </p>
          </div>
          <div className="flex flex-col items-start pb-5">
            <h2 className="text-sm font-bold mb-2 uppercase">Links</h2>
            <ItemList />
          </div>
          
          <div className="flex flex-col items-start md:items-end pb-5">
            <h2 className="text-sm font-bold mb-2 uppercase">Stay Connected</h2>
            <div className="flex space-x-2">
              <a
                href="https://www.facebook.com/DivarisMakahariscollege/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <FaFacebookSquare className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;
