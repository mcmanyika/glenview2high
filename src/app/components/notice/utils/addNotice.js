import { database } from '../../../../../utils/firebaseConfig';
import { ref, push } from "firebase/database";

const addNotice = async (title, details, postedBy, date) => {
  try {
    const noticesRef = ref(database, 'notices');
    const newNoticeRef = push(noticesRef);
    await newNoticeRef.set({
      title,
      details,
      posted_by: postedBy,
      date,
    });
    console.log("Notice added with ID: ", newNoticeRef.key);
  } catch (e) {
    console.error("Error adding notice: ", e);
  }
};

export default addNotice;
