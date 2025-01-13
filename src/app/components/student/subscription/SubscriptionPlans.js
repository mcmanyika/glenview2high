import React, { useState, useEffect } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useGlobalState } from '../../../store';
import { toast } from 'react-toastify';
import { ref, set, get, serverTimestamp } from 'firebase/database';
import { database } from '../../../../../utils/firebaseConfig';
import Link from 'next/link';

const SubscriptionPlans = () => {
  const { data: session } = useSession();
  const [studentId] = useGlobalState('studentId');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isUnderReview, setIsUnderReview] = useState(false);

  const plan = {
    name: 'School Term Package',
    price: '6.00',
    duration: 'Per Term',
    features: [
      'Full access to all courses',
      'Assignment submission',
      'Progress tracking',
      'Download study materials',
      'Attendance reports',
      'Email support',
      'End of Term Reports',
      'Parent portal access',
      'Valid for entire school term'
    ]
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if (studentId) {
        try {
          const subscriptionRef = ref(database, `students/${studentId}/subscription`);
          const snapshot = await get(subscriptionRef);
          
          if (snapshot.exists()) {
            const subscription = snapshot.val();
            const isActive = subscription.status === 'approved';
            const underReview = subscription.status === 'pending';
            const hasNotExpired = subscription.endDate > Date.now();
            setHasSubscription(isActive && hasNotExpired);
            setSubscriptionStatus(subscription.status);
            setIsUnderReview(underReview);
            console.log('Subscription Status:', subscription.status);
            console.log('Is Under Review:', underReview);
          } else {
            setHasSubscription(false);
            setSubscriptionStatus(null);
            setIsUnderReview(false);
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
      setIsLoading(false);
    };

    checkSubscription();
  }, [studentId]);

  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();
    if (!confirmationId.trim()) {
      toast.error('Please enter a confirmation ID');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const currentDate = new Date();
      const termDates = calculateTermDates(currentDate);

      await set(ref(database, `students/${studentId}/subscription`), {
        status: 'Pending',
        startDate: serverTimestamp(),
        endDate: termDates.endDate,
        termPeriod: termDates.termName,
        plan: 'School Term Package',
        confirmationId: confirmationId.trim(),
        updatedAt: serverTimestamp(),
        email: session?.user?.email
      });

      setHasSubscription(true);
      toast.success('Term subscription activated successfully!');
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error submitting confirmation:', error);
      toast.error('Failed to submit confirmation ID. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTermDates = (currentDate) => {
    const year = currentDate.getFullYear();
    
    const terms = {
      term1: {
        start: new Date(year, 0, 1),
        end: new Date(year, 3, 30),
        name: 'Term 1'
      },
      term2: {
        start: new Date(year, 4, 1),
        end: new Date(year, 7, 31),
        name: 'Term 2'
      },
      term3: {
        start: new Date(year, 8, 1),
        end: new Date(year, 11, 31),
        name: 'Term 3'
      }
    };

    // Find current or next term
    let currentTerm;
    const termsArray = Object.values(terms);
    
    // First try to find the current term
    for (const term of termsArray) {
      if (currentDate >= term.start && currentDate <= term.end) {
        currentTerm = term;
        break;
      }
    }

    // If no current term found, find the next term
    if (!currentTerm) {
      for (const term of termsArray) {
        if (currentDate < term.start) {
          currentTerm = term;
          break;
        }
      }
      // If we're after the last term of the year, use first term of next year
      if (!currentTerm) {
        currentTerm = {
          ...terms.term1,
          start: new Date(year + 1, 0, 1),
          end: new Date(year + 1, 3, 30)
        };
      }
    }

    return {
      endDate: currentTerm.end.getTime(),
      termName: currentTerm.name
    };
  };

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    
    script.onload = () => {
      const stripeButton = document.querySelector('stripe-buy-button');
      stripeButton?.addEventListener('buy-button:success', () => {
        setShowConfirmationModal(true);
      });
    };

    document.body.appendChild(script);

    return () => {
      const stripeButton = document.querySelector('stripe-buy-button');
      stripeButton?.removeEventListener('buy-button:success', () => {});
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (hasSubscription || subscriptionStatus === 'Pending') {
    return (
      <div className="py-8 text-center">
        {subscriptionStatus === 'Pending' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Payment Under Review</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment is currently being processed. We will notify you once it is confirmed.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    (!isUnderReview && subscriptionStatus !== 'pending') && (
      <>
        <div className="py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Student Subscription</h2>
          <div className="max-w-md mx-auto">
            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow
                        bg-white flex flex-col dark:bg-slate-900 dark:border-slate-800">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-3 dark:text-white">{plan.name}</h3>
                <p className="text-4xl font-bold text-blue-600">
                  ${plan.price}
                  <span className="text-sm text-gray-600 dark:text-gray-400">/{plan.duration}</span>
                </p>
              </div>
              
              <div className="flex-grow space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <FaCheck className="text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                
                  <stripe-buy-button
                    buy-button-id="buy_btn_1QeQRPHXrdQYsUmnAdiD3kKg"
                    publishable-key="pk_live_51MJe2UHXrdQYsUmndYJEEaLJrPLEUpWXEjlsHaJCYvcifZAJcD5O4dRjgRIgByLhM9w18AN6DNXzznxHiau1mLTw00k4RM3DxI"
                  />
                
              </div>
              <button
                onClick={() => setShowConfirmationModal(true)}
                className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 hover:text-blue-500 transition-colors cursor-pointer"
              >
                Submit payment confirmation ID
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-md w-full shadow-xl">
              <h3 className="text-xl font-bold mb-4 dark:text-white">
                Complete Your Subscription
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Please enter the payment confirmation ID to activate your subscription.
              </p>
              
              <form onSubmit={handleConfirmationSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="confirmationId" 
                    className="block text-sm font-medium mb-2 dark:text-gray-300"
                  >
                    Payment Confirmation ID
                  </label>
                  <input
                    type="text"
                    id="confirmationId"
                    value={confirmationId}
                    onChange={(e) => setConfirmationId(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
                             dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                    placeholder="Enter the ID from your payment confirmation"
                    maxLength={50}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowConfirmationModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 
                             dark:text-gray-300 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      'Activate Subscription'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default SubscriptionPlans;