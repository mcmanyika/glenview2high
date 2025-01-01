import { useState, useEffect } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import withAuth from '../../../../../utils/withAuth';

const StudentReport = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStudentData, setSelectedStudentData] = useState(null);
  const [students, setStudents] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modified form state to remove comments
  const [formData, setFormData] = useState({
    subjects: [
      {
        name: '',
        possibleMark: '100',
        obtainedMark: '',
        classAverage: '',
        effortGrade: '',
        remarks: '',
        teacherEmail: session?.user?.email || '',
        teacherName: session?.user?.name || ''
      }
    ],
    term: 'First Term',
    year: new Date().getFullYear().toString(),
    teacherEmail: session?.user?.email || '',
    teacherName: session?.user?.name || ''
  });

  // Add new subject
  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: '',
          possibleMark: '100',
          obtainedMark: '',
          classAverage: '',
          effortGrade: '',
          remarks: '',
          teacherEmail: session?.user?.email || '',
          teacherName: session?.user?.name || ''
        }
      ]
    }));
  };

  // Remove subject - prevent removing last subject
  const removeSubject = (index) => {
    if (formData.subjects.length <= 1) {
      toast.warning('At least one subject is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  // Handle subject input changes
  const handleSubjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    }));
  };

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = ref(database, 'userTypes');
        const snapshot = await get(studentsRef);
        
        if (snapshot.exists()) {
          const studentsData = Object.entries(snapshot.val())
            .filter(([_, user]) => user.userType === 'student')
            .map(([id, user]) => ({
              id,
              name: `${user.firstName} ${user.lastName}`,
              class: user.class,
              admissionNumber: user.userID
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setStudents(studentsData);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch selected student's data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!selectedStudent) {
        setSelectedStudentData(null);
        return;
      }

      try {
        const studentRef = ref(database, `userTypes/${selectedStudent}`);
        const snapshot = await get(studentRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSelectedStudentData({
            name: `${data.firstName} ${data.lastName}`,
            class: data.class,
            admissionNumber: data.userID
          });
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  // Fetch student report data when a student is selected
  useEffect(() => {
    const fetchStudentReport = async () => {
      if (!selectedStudent) return;

      try {
        setLoading(true);
        // Fetch grades
        const gradesRef = ref(database, `grades/${selectedStudent}`);
        const gradesSnapshot = await get(gradesRef);
        
        // Fetch attendance
        const attendanceRef = ref(database, `attendance/${selectedStudent}`);
        const attendanceSnapshot = await get(attendanceRef);

        if (gradesSnapshot.exists() && attendanceSnapshot.exists()) {
          const grades = gradesSnapshot.val();
          const attendance = attendanceSnapshot.val();
          
          // Process and set report data
          setReportData({
            grades,
            attendance,
            // Add other relevant data
          });
        }
      } catch (error) {
        console.error('Error fetching student report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentReport();
  }, [selectedStudent]);

  const handleInputChange = (subject, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: value
        }
      }
    }));
  };

  const calculateGrade = (obtained, possible) => {
    const percentage = (obtained / possible) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Add this function to fetch existing subjects
  const fetchExistingSubjects = async (studentId, term, year) => {
    try {
      const reportRef = ref(database, `reports/${studentId}/${term}_${year}`);
      const snapshot = await get(reportRef);
      
      if (snapshot.exists()) {
        return snapshot.val().subjects || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching existing subjects:', error);
      return [];
    }
  };

  // Modified handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      setLoading(true);
      
      // Process new subjects
      const processedSubjects = formData.subjects.map(subject => {
        const possibleMark = parseFloat(subject.possibleMark) || 100;
        const obtainedMark = parseFloat(subject.obtainedMark) || 0;
        const classAverage = parseFloat(subject.classAverage) || 0;
        
        return {
          ...subject,
          possibleMark,
          obtainedMark,
          classAverage,
          percentage: ((obtainedMark / possibleMark) * 100).toFixed(1),
          grade: calculateGrade(obtainedMark, possibleMark)
        };
      });

      // Fetch existing subjects
      const existingSubjects = await fetchExistingSubjects(
        selectedStudent, 
        formData.term, 
        formData.year
      );

      // Merge existing and new subjects, avoiding duplicates
      const mergedSubjects = [...existingSubjects];
      processedSubjects.forEach(newSubject => {
        const existingIndex = mergedSubjects.findIndex(
          existing => existing.name.toLowerCase() === newSubject.name.toLowerCase()
        );
        
        if (existingIndex !== -1) {
          // Update existing subject
          mergedSubjects[existingIndex] = newSubject;
        } else {
          // Add new subject
          mergedSubjects.push(newSubject);
        }
      });

      // Add student data to the report
      const reportData = {
        ...formData,
        subjects: mergedSubjects, // Use merged subjects
        studentName: selectedStudentData?.name,
        class: selectedStudentData?.class,
        admissionNumber: selectedStudentData?.admissionNumber,
        timestamp: Date.now(),
        lastUpdatedBy: session?.user?.email || '',
        lastUpdateDate: new Date().toISOString()
      };

      const reportRef = ref(database, `reports/${selectedStudent}/${formData.term}_${formData.year}`);
      await set(reportRef, reportData);

      toast.success('Report saved successfully');
      
      // Redirect to all-reports page
      router.push('/teacher/report/all-reports');
      
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error(`Error saving report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add this effect to load existing subjects when a student is selected
  useEffect(() => {
    const loadExistingReport = async () => {
      if (!selectedStudent) return;

      try {
        const existingSubjects = await fetchExistingSubjects(
          selectedStudent,
          formData.term,
          formData.year
        );

        if (existingSubjects.length > 0) {
          // Update form with existing subjects
          setReportData(prev => ({
            ...prev,
            subjects: existingSubjects
          }));
        }
      } catch (error) {
        console.error('Error loading existing report:', error);
      }
    };

    loadExistingReport();
  }, [selectedStudent, formData.term, formData.year]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-main3"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Student Selection - Updated styling */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Student Report Card</h1>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Select Student
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:ring-2 focus:ring-main3 focus:border-transparent transition-all duration-200"
        >
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} - Class {student.class}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
          {/* Student Info Display - Enhanced */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-4 dark:border-slate-700">
              Report for {selectedStudentData?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Class:</span>
                <span className="text-gray-800 dark:text-white">{selectedStudentData?.class}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Admission Number:</span>
                <span className="text-gray-800 dark:text-white">{selectedStudentData?.admissionNumber}</span>
              </div>
            </div>
          </div>

          {/* Term Selection - Enhanced */}
          <div className="mb-8">
            <label className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Academic Term
            </label>
            <select
              value={formData.term}
              onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
              className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:ring-2 focus:ring-main3 focus:border-transparent transition-all duration-200"
            >
              <option value="First Term">First Term</option>
              <option value="Second Term">Second Term</option>
              <option value="Third Term">Third Term</option>
            </select>
          </div>

          {/* Subjects Section - Enhanced */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Subject Grades</h3>
            </div>

            {formData.subjects.map((subject, index) => (
              <div key={index} className="mb-6 p-6 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 transition-all duration-200 hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:ring-2 focus:ring-main3 focus:border-transparent transition-all duration-200"
                      placeholder="Enter subject name"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Possible Mark</label>
                    <input
                      type="number"
                      min="0"
                      value={subject.possibleMark}
                      onChange={(e) => handleSubjectChange(index, 'possibleMark', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Obtained Mark</label>
                    <input
                      type="number"
                      min="0"
                      max={subject.possibleMark}
                      value={subject.obtainedMark}
                      onChange={(e) => handleSubjectChange(index, 'obtainedMark', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Class Average</label>
                    <input
                      type="number"
                      min="0"
                      max={subject.possibleMark}
                      value={subject.classAverage}
                      onChange={(e) => handleSubjectChange(index, 'classAverage', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Effort Grade</label>
                    <select
                      value={subject.effortGrade}
                      onChange={(e) => handleSubjectChange(index, 'effortGrade', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A - Excellent</option>
                      <option value="B">B - Very Good</option>
                      <option value="C">C - Good</option>
                      <option value="D">D - Fair</option>
                      <option value="E">E - Poor</option>
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-base text-gray-600 dark:text-gray-400 mb-2">Remarks</label>
                    <input
                      type="text"
                      value={subject.remarks}
                      onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-white dark:bg-white dark:text-gray-800 text-base focus:ring-2 focus:ring-main3"
                      placeholder="Enter remarks for this subject"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.subjects.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Click Add Subject to begin adding subjects to the report.
              </p>
            )}
          </div>

          {/* Action Buttons - Enhanced */}
          <div className="flex justify-end space-x-4 border-t dark:border-slate-700 pt-6">
            <button
              type="button"
              onClick={addSubject}
              className="px-6 py-3 bg-main3 text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Subject</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-main text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    {/* ... loading spinner SVG ... */}
                  </svg>
                  <span>Saving...</span>
                </span>
              ) : (
                <span>Save Report</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default withAuth(StudentReport);