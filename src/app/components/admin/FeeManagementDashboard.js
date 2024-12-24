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
        filteredStudents={filteredStudents}
        paymentStatus={paymentStatus}
        onStudentClick={handleStudentClick}
      />

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
