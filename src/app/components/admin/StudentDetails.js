const handlePaymentSubmit = async (paymentData) => {
  try {
    const { feeId, amount } = paymentData;
    
    // Create payment record
    const paymentId = Date.now().toString();
    const updates = {};
    
    // Update the specific fee's remaining amount
    updates[`studentFees/${studentId}/${feeId}/remainingAmount`] = paymentData.remainingAfterPayment;
    
    // Add the payment record
    updates[`studentFees/${studentId}/${feeId}/payments/${paymentId}`] = {
      ...paymentData,
      id: paymentId
    };

    // Update the database
    await update(ref(database), updates);
    
    toast.success('Payment recorded successfully');
    onClose();
  } catch (error) {
    console.error('Error processing payment:', error);
    toast.error('Failed to process payment');
  }
}; 