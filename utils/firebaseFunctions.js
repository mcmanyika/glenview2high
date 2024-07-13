
import { database } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

export const fetchItems = (callback) => {
    const itemsRef = ref(database, 'title'); // Assuming 'items' is your Firebase database path
  
    onValue(itemsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        items.push(item);
      });
      callback(items);
    });
  };