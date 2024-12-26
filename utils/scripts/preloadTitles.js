const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { ref, set } = require('firebase/database');

const firebaseConfig = {
    apiKey: 'AIzaSyDdClopB_iRI-UCm228U7a8yPLPCooZwEA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: 'glenview2-b3d45',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const defaultTitles = {
    "title1": {
      "title": "Dashboard",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/dashboard",
      "icon": "FaTachometerAlt"
    },
    "title2": {
      "title": "Add Class",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/add_classes",
      "icon": "RiAdminFill"
    },
    "title3": {
      "title": "Payments",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/finance_dashboard",
      "icon": "FaCashRegister"
    },
    "title4": {
      "title": "Accounts",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/admissions_list",
      "icon": "IoPeopleOutline"
    },
    "title5": {
      "title": "Class Allocation",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/add_classes",
      "icon": "RiAdminFill"
    },
    "title6": {
      "title": "Class Routine",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/class_routine",
      "icon": "FaCalendarAlt"
    },
    "title7": {
      "title": "Exams",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/exams",
      "icon": "FaClipboardList"
    },
    "title8": {
      "title": "Notices",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/notices",
      "icon": "MdOutlineLibraryBooks"
    },
    "title9": {
      "title": "Contact Us",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/contact_us",
      "icon": "MdOutlineLibraryBooks"
    },
    "title10": {
      "title": "Assignments",
      "category": "dashboard",
      "status": "Active",
      "link": "/teacher/assignments",
      "icon": "FaCalendarAlt"
    },
    "title11": {
      "title": "Admission",
      "category": "dashboard",
      "status": "Active",
      "link": "/admin/admissions_list",
      "icon": "IoPeopleOutline"
    },
    "title12": {
      "title": "Applicants",
      "category": "dashboard",
      "status": "Active",
      "link": "/students/enroll",
      "icon": "IoPeopleOutline"
    },
    "title13": {
      "title": "Term Reports",
      "category": "dashboard",
      "status": "Active",
      "link": "/students/reports",
      "icon": "FaClipboardList"
    },
    "title14": {
      "title": "Attendance",
      "category": "dashboard",
      "status": "Active",
      "link": "/attendance",
      "icon": "FaCheckCircle"
    },
    "title15": {
      "title": "Student Report",
      "category": "dashboard",
      "status": "Active",
      "link": "/teacher/report/student-report",
      "icon": "MdOutlineLibraryBooks"
    },
    "title16": {
      "title": "My Assignments",
      "category": "dashboard",
      "status": "Active",
      "link": "/students/assignments",
      "icon": "FaCalendarAlt"
    },
    "title17": {
      "title": "Finance",
      "category": "dashboard",
      "status": "Active",
      "link": "/students/finance",
      "icon": "FaCashRegister"
    }
};

async function preloadTitles() {
  try {
    console.log('Starting title preload...');
    const titleRef = ref(database, 'titles');
    await set(titleRef, defaultTitles);
    console.log('Titles preloaded successfully');
    return true;
  } catch (error) {
    console.error('Error preloading titles:', error);
    return false;
  }
}

// Run the initialization
preloadTitles()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Initialization error:', error);
    process.exit(1);
  });

  //npm run preload-titles