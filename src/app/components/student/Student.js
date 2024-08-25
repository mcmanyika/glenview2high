import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '../../../../utils/firebaseConfig';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';

const AdmissionsList = () => {
  const { data: session } = useSession();
  const [admissions, setAdmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAdmissions = async () => {
        const admissionsRef = ref(database, 'admissions');
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (admissions.length === 0) {
    return <div>No admissions found for your email.</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {admissions.map((admission) => (
          <div key={admission.id} className="border w-full p-4 rounded shadow-sm bg-white mb-4">
            <div className="flex mb-2">
              <div className="flex-1"><strong>Student ID:</strong></div>
              <div className="flex-1">{admission.studentNumber}</div>
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
              <div className="flex-1">{admission.gender}</div>
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
    </div>
  );
};

export default AdmissionsList;
