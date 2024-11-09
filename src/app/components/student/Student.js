import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, query, orderByChild, equalTo, onValue, update } from 'firebase/database';

const AdmissionsList = () => {
  const { data: session } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAdmissions = async () => {
        const admissionsRef = ref(database, 'userTypes');
        const emailQuery = query(admissionsRef, orderByChild('email'), equalTo(session.user.email));

        onValue(emailQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const admissionsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setAdmissions(admissionsArray);
          } else {
            setAdmissions([]);
          }
          setIsLoading(false);
        });
      };

      fetchAdmissions();
    }
  }, [session?.user?.email]);

  const handleEditClick = (admission) => {
    setSelectedAdmission(admission);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    if (selectedAdmission) {
      const admissionRef = ref(database, `userTypes/${selectedAdmission.id}`);
      await update(admissionRef, selectedAdmission);
      setShowModal(false);
      window.location.reload();
    }
  };

  const handleChange = (e) => {
    setSelectedAdmission({
      ...selectedAdmission,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <div></div>;
  }

  if (admissions.length === 0) {
    return <div>No admissions found for your email.</div>;
  }

  return (
    <div className="w-full text-sm h-screen">
      <div className="w-full">
        {admissions.map((admission) => (
          <div key={admission.id} className="w-full p-4 rounded  bg-white mb-4">
            <div className="relative  w-full pl-0 p-4 mb-4">
              <div className='text-xl font-bold'>My Details</div>
              <div 
                className="three-dots absolute top-4 right-4 flex flex-col space-y-1 cursor-pointer"
                onClick={() => handleEditClick(admission)}
              >
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Student ID:</strong></div>
              <div className="flex-1">{admission.userID}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Email:</strong></div>
              <div className="flex-1">{admission.email}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Phone:</strong></div>
              <div className="flex-1">{admission.phone}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Date of Birth:</strong></div>
              <div className="flex-1">{admission.dateOfBirth}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Gender:</strong></div>
              <div className="flex-1 capitalize">{admission.gender}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Religion:</strong></div>
              <div className="flex-1">{admission.religion}</div>
            </div>
            <div className="flex mb-2">
              <div className="flex-1"><strong>Class:</strong></div>
              <div className="flex-1">{admission.class}</div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedAdmission && (
        <div 
          className="fixed inset-0 bg-gray-600 z-50 bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowModal(false)} // Close the modal when clicking on the overlay
        >
          <div 
            className="bg-white p-4 rounded shadow-lg w-1/2"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-xl mb-4">Edit Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-2">
                <label className="block mb-1">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedAdmission.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Date of Birth:</label>
                <input
                  type="text"
                  name="dateOfBirth"
                  value={selectedAdmission.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Gender:</label>
                <select
                  name="gender"
                  value={selectedAdmission.gender}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Religion:</label>
                <select
                  name="religion"
                  value={selectedAdmission.religion}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Religion</option>
                  <option value="Chivanhu">Chivanhu</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Islam">Islam</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Class:</label>
                <select
                  name="class"
                  value={selectedAdmission.class}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Class</option>
                  {['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C', '5A', '5B', '5C', '6A', '6B', '6C'].map((classOption) => (
                    <option key={classOption} value={classOption}>{classOption}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                className="mr-2 p-2 bg-gray-400 text-white rounded" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="p-2 bg-blue-500 text-white rounded" 
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmissionsList;
