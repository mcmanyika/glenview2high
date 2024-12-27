import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, update, push } from 'firebase/database';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentHistoryTable from './FeeManagement/components/PaymentHistoryTable';
import PaymentEditModal from './FeeManagement/components/PaymentEditModal';
import AddPaymentModal from './FeeManagement/components/AddPaymentModal';
import StudentTable from './FeeManagement/components/StudentTable';
import SearchBar from './FeeManagement/components/SearchBar';
import StudentPaymentModal from './FeeManagement/components/StudentPaymentModal';

const FeeManagementDashboard = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentEditModalOpen, setIsPaymentEditModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6); // Number of students per page

  const paymentStatus = {
    PAID: 'Paid',
    PARTIAL: 'Partial',
    PENDING: 'Pending',
    OVERDUE: 'Overdue'
  };

  // Fetch students and payments data
  useEffect(() => {
    const studentsRef = ref(database, 'userTypes');
    const studentFeesRef = ref(database, 'studentFees');

    const studentFeesUnsubscribe = onValue(studentFeesRef, (snapshot) => {
      const data = snapshot.val();
      setAllPayments(data || {});
    });

    const studentsUnsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentsArray = Object.entries(data)
          .filter(([_, user]) => user.userType === 'student')
          .map(([id, user]) => ({
            id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            class: user.class || 'Not Assigned',
            email: user.email,
            userID: user.userID || 'N/A',
            status: paymentStatus.PAID
          }));
        setStudents(studentsArray);
      }
      setLoading(false);
    });

    return () => {
      studentFeesUnsubscribe();
      studentsUnsubscribe();
    };
  }, []);

  // Fetch selected student's payments
  useEffect(() => {
    if (selectedStudent) {
      const studentFeesRef = ref(database, `studentFees/${selectedStudent.id}`);
      const unsubscribe = onValue(studentFeesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const feesArray = Object.entries(data).map(([feeId, fee]) => {
            const payments = fee.payments || {};
            const paymentsList = Object.entries(payments).map(([paymentId, payment]) => ({
              id: paymentId,
              feeId,
              ...payment,
              date: new Date(payment.date).toLocaleDateString()
            }));
            return {
              id: feeId,
              ...fee,
              payments: paymentsList
            };
          });
          
          // Flatten all payments for the payment history
          const allPayments = feesArray.flatMap(fee => fee.payments);
          setPayments(allPayments.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          setPayments([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedStudent]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentEditModalOpen(true);
  };

  const handlePaymentUpdate = async (updatedPayment) => {
    try {
      const { feeId, id: paymentId } = selectedPayment;
      const paymentRef = ref(database, `studentFees/${selectedStudent.id}/${feeId}/payments/${paymentId}`);
      await update(paymentRef, {
        ...updatedPayment,
        updatedAt: Date.now()
      });
      setIsPaymentEditModalOpen(false);
      toast.success('Payment updated successfully!');
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error('Error updating payment');
    }
  };

  const handleAddPayment = () => {
    setIsAddPaymentModalOpen(true);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.userID.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full p-8 bg-white">
      <SearchBar 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <StudentTable 
        filteredStudents={currentStudents} // Use paginated students
        paymentStatus={paymentStatus}
        onStudentClick={handleStudentClick}
      />

      {/* Pagination Component */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between sm:hidden">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{indexOfFirstStudent + 1}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min(indexOfLastStudent, filteredStudents.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{filteredStudents.length}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => paginate(idx + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${currentPage === idx + 1
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {isModalOpen && selectedStudent && (
        <StudentPaymentModal
          student={selectedStudent}
          payments={payments}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
          onAddPayment={() => setIsAddPaymentModalOpen(true)}
          onPaymentClick={handlePaymentClick}
          paymentStatus={paymentStatus}
        />
      )}

      {isPaymentEditModalOpen && selectedPayment && (
        <PaymentEditModal
          isOpen={isPaymentEditModalOpen}
          onClose={() => {
            setIsPaymentEditModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onUpdate={handlePaymentUpdate}
          onChange={setSelectedPayment}
          paymentStatus={paymentStatus}
        />
      )}

      {isAddPaymentModalOpen && selectedStudent && (
        <AddPaymentModal
          isOpen={isAddPaymentModalOpen}
          onClose={() => setIsAddPaymentModalOpen(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
};

export default FeeManagementDashboard;
