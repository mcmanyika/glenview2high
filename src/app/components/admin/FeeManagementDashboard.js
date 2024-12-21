import React, { useState, useEffect } from "react";
import { database } from '../../../../utils/firebaseConfig';
import { ref, onValue, update, push } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentHistoryTable from './FeeManagement/components/PaymentHistoryTable';
import PaymentEditModal from './FeeManagement/components/PaymentEditModal';
import AddPaymentModal from './FeeManagement/components/AddPaymentModal';

const FeeManagementDashboard = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentEditModalOpen, setIsPaymentEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);

  const paymentStatus = {
    PAID: 'Paid',
    PARTIAL: 'Partial',
    PENDING: 'Pending',
    OVERDUE: 'Overdue'
  };

  useEffect(() => {
    const paymentsRef = ref(database, 'payments');
    const studentsRef = ref(database, 'userTypes');

    const paymentsUnsubscribe = onValue(paymentsRef, (snapshot) => {
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
            status: user.feeStatus || paymentStatus.PENDING
          }));
        setStudents(studentsArray);
      }
      setLoading(false);
    });

    return () => {
      paymentsUnsubscribe();
      studentsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const paymentsRef = ref(database, `payments/${selectedStudent.id}`);
      const unsubscribe = onValue(paymentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const paymentsArray = Object.entries(data).map(([id, payment]) => ({
            id,
            ...payment,
            date: new Date(payment.date).toLocaleDateString()
          }));
          setPayments(paymentsArray.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    try {
      const paymentRef = ref(database, `payments/${selectedStudent.id}/${selectedPayment.id}`);
      await update(paymentRef, {
        ...selectedPayment,
        updatedAt: new Date().toISOString()
      });

      setIsPaymentEditModalOpen(false);
      toast.success('Payment updated successfully!');
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error('Error updating payment');
    }
  };

  const handleAddPayment = async (newPayment) => {
    try {
      const paymentRef = ref(database, `payments/${selectedStudent.id}`);
      await push(paymentRef, {
        ...newPayment,
        status: paymentStatus.PAID,
        timestamp: new Date().toISOString(),
        studentId: selectedStudent.id,
        studentName: selectedStudent.name
      });

      const studentRef = ref(database, `userTypes/${selectedStudent.id}`);
      await update(studentRef, {
        feeStatus: paymentStatus.PAID,
        lastPaymentDate: newPayment.date,
        updatedAt: new Date().toISOString()
      });

      setIsAddPaymentModalOpen(false);
      toast.success('Payment added successfully!');
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error('Error adding payment');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.userID.toLowerCase().includes(search.toLowerCase())
  );

  const StudentPaymentModal = () => {
    const paymentSummary = {
      total: payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
      paid: payments.filter(p => p.status === paymentStatus.PAID)
        .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
      pending: payments.filter(p => p.status === paymentStatus.PENDING)
        .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0),
      partial: payments.filter(p => p.status === paymentStatus.PARTIAL)
        .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-xl font-bold">Payment History - {selectedStudent.name}</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsAddPaymentModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Payment
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-blue-700">${paymentSummary.total.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-700">${paymentSummary.paid.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Partial Amount</p>
                <p className="text-2xl font-bold text-yellow-700">${paymentSummary.partial.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-red-700">${paymentSummary.pending.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-semibold">{selectedStudent.userID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-semibold">{selectedStudent.class}</p>
                </div>
              </div>
            </div>

            <PaymentHistoryTable
              payments={payments}
              paymentStatus={paymentStatus}
              handlePaymentClick={handlePaymentClick}
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        
      </div>

      <div className="w-full mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 pl-10 border border-gray-200 rounded-xl w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg 
            className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr 
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.userID}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{student.name}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{student.class}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    student.status === paymentStatus.PAID ? 'bg-green-100 text-green-800' :
                    student.status === paymentStatus.PARTIAL ? 'bg-yellow-100 text-yellow-800' :
                    student.status === paymentStatus.OVERDUE ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <StudentPaymentModal />}

      <PaymentEditModal
        isOpen={isPaymentEditModalOpen}
        onClose={() => setIsPaymentEditModalOpen(false)}
        payment={selectedPayment}
        onUpdate={handlePaymentUpdate}
        onChange={setSelectedPayment}
        paymentStatus={paymentStatus}
      />

      <AddPaymentModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        onSubmit={handleAddPayment}
        studentName={selectedStudent?.name}
      />
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

export default FeeManagementDashboard;
