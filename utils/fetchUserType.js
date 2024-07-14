import { ref, get } from 'firebase/database';
import { database } from './firebaseConfig';

const fetchUserType = async (email) => {
  try {
    const userRef = ref(database, `users/${email.replace('.', '_')}/userType`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user type:', error);
    return null;
  }
};

export default fetchUserType;
