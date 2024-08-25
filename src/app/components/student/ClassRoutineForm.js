import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ref, push } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClassRoutineForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    subject: '',
    teacher: session?.user?.name || '',
    room: '',
    studentclass: '',
    email: session?.user?.email || '', // Added email field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const routineRef = ref(database, 'classRoutine');
    push(routineRef, formData)
      .then(() => {
        toast.success('Class routine added successfully');
        setFormData({
          day: '',
          time: '',
          subject: '',
          teacher: session?.user?.name || '',
          room: '',
          studentclass: '',
          email: session?.user?.email || '', // Reset email field
        });
      })
      .catch((error) => {
        console.error('Error adding class routine:', error);
        toast.error('Error adding class routine');
      });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Add Class Routine</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 text-sm'>
          <div className="m-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="m-4">
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Time</option>
              <option value="08:00 - 09:00">08:00 - 09:00</option>
              <option value="09:00 - 10:00">09:00 - 10:00</option>
              <option value="10:00 - 11:00">10:00 - 11:00</option>
              <option value="11:00 - 12:00">11:00 - 12:00</option>
              <option value="12:00 - 01:00">12:00 - 01:00</option>
              <option value="01:00 - 02:00">01:00 - 02:00</option>
              <option value="02:00 - 03:00">02:00 - 03:00</option>
              <option value="03:00 - 04:00">03:00 - 04:00</option>
            </select>
          </div>
          <div className="m-4">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
          <div className="m-4">
            <select
              name="studentclass"
              value={formData.studentclass}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Class</option>
              <option value="1A">1A</option>
              <option value="1B">1B</option>
              <option value="1C">1C</option>
              <option value="2A">2A</option>
              <option value="2B">2B</option>
              <option value="2C">2C</option>
              <option value="3A">3A</option>
              <option value="3B">3B</option>
              <option value="3C">3C</option>
              <option value="4A">4A</option>
              <option value="4B">4B</option>
              <option value="4C">4C</option>
            </select>
          </div>
          <div className="m-4">
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Room</option>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((room) => (
                <option key={room} value={room}>
                  Room {room}
                </option>
              ))}
            </select>
          </div>
          <div className="m-4">
            <input
              type="hidden"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
            />
            <input
              type="hidden"
              name="email"
              value={formData.email} // Hidden email field
              onChange={handleChange}
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Add Routine
            </button>
          </div>
        </div>
      </form>
      
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default ClassRoutineForm;
