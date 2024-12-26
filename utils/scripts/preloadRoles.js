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

const defaultRoles = {
  "SUPER_ADMIN": {
    "name": "Super Administrator",
    "level": 100,
    "description": "Full system access with all privileges",
    "permissions": {
      "users_manage": true,
      "roles_manage": true,
      "system_settings": true,
      "all_schools_access": true,
      "financial_manage": true,
      "content_manage": true,
      "reports_access": true,
      "audit_logs_view": true
    }
  },
  "SCHOOL_ADMIN": {
    "name": "School Administrator",
    "level": 90,
    "description": "School-wide administrative access",
    "permissions": {
      "school_manage": true,
      "teachers_manage": true,
      "students_manage": true,
      "school_settings": true,
      "school_finance_view": true,
      "school_reports": true,
      "announcements_manage": true,
      "events_manage": true
    }
  },
  "TEACHER": {
    "name": "Teacher",
    "level": 80,
    "description": "Teaching and student management access",
    "permissions": {
      "classes_manage": true,
      "grades_manage": true,
      "attendance_manage": true,
      "student_progress_view": true,
      "course_content_manage": true,
      "assignments_manage": true,
      "parent_communication": true,
      "resources_manage": true
    }
  },
  "FINANCE_STAFF": {
    "name": "Finance Staff",
    "level": 70,
    "description": "Financial management access",
    "permissions": {
      "payments_manage": true,
      "fees_manage": true,
      "financial_reports": true,
      "invoices_manage": true,
      "expenses_manage": true,
      "budgets_view": true,
      "transactions_manage": true
    }
  },
  "LIBRARIAN": {
    "name": "Librarian",
    "level": 65,
    "description": "Library management access",
    "permissions": {
      "books_manage": true,
      "loans_manage": true,
      "library_reports": true,
      "resources_manage": true,
      "catalog_manage": true
    }
  },
  "STUDENT": {
    "name": "Student",
    "level": 50,
    "description": "Student access to learning resources",
    "permissions": {
      "courses_view": true,
      "grades_view": true,
      "assignments_submit": true,
      "resources_access": true,
      "payments_view": true,
      "attendance_view": true,
      "library_access": true,
      "events_view": true
    }
  },
  "PARENT": {
    "name": "Parent/Guardian",
    "level": 40,
    "description": "Parent access to child's information",
    "permissions": {
      "child_progress_view": true,
      "attendance_view": true,
      "payments_view": true,
      "teachers_contact": true,
      "events_view": true,
      "announcements_view": true,
      "reports_view": true
    }
  },
  "SUPPORT_STAFF": {
    "name": "Support Staff",
    "level": 30,
    "description": "General support staff access",
    "permissions": {
      "basic_student_info": true,
      "attendance_view": true,
      "events_view": true,
      "announcements_view": true
    }
  },
  "GUEST": {
    "name": "Guest",
    "level": 10,
    "description": "Limited access to public resources",
    "permissions": {
      "public_content_view": true,
      "course_catalog_view": true,
      "events_view": true,
      "announcements_view": true
    }
  }
};

async function preloadRoles() {
  try {
    const rolesRef = ref(database, 'roles/role_definitions');
    await set(rolesRef, defaultRoles);
    console.log('Roles preloaded successfully');
    return true;
  } catch (error) {
    console.error('Error preloading roles:', error);
    return false;
  }
}

async function assignInitialSuperAdmin(userId, email) {
  try {
    const userRoleRef = ref(database, `roles/user_roles/${userId}`);
    await set(userRoleRef, {
      role: 'SUPER_ADMIN',
      email: email,
      assignedAt: new Date().toISOString(),
      assignedBy: 'SYSTEM',
      isActive: true
    });
    console.log('Initial Super Admin assigned successfully');
    return true;
  } catch (error) {
    console.error('Error assigning initial Super Admin:', error);
    return false;
  }
}

async function initializeRoles() {
  try {
    console.log('Starting role preload...');
    await preloadRoles();
    console.log('Roles preloaded successfully');

    await assignInitialSuperAdmin('mcmanyika', 'mcmanyika@gmail.com');
    console.log('Super admin assigned successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeRoles();