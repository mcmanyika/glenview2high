import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import CountUp from 'react-countup';

const COLORS = ["#2196F3", "#64B5F6", "#90CAF9", "#BBDEFB"]; // Different shades of blue from darker to lighter

const PaymentsChart = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    const paymentsRef = ref(database, 'payments');
    
    onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let totalPaid = 0;
        let totalPending = 0;
        let totalPartial = 0;

        Object.values(data).forEach(studentPayments => {
          if (studentPayments) {
            Object.values(studentPayments).forEach(payment => {
              const amount = parseFloat(payment.amount) || 0;
              switch (payment.status) {
                case 'Paid':
                  totalPaid += amount;
                  break;
                case 'Pending':
                  totalPending += amount;
                  break;
                case 'Partial':
                  totalPartial += amount;
                  break;
                default:
                  break;
              }
            });
          }
        });

        setPaymentsData([
          { name: "Paid", value: Math.round(totalPaid) },
          { name: "Pending", value: Math.round(totalPending) },
          { name: "Partial", value: Math.round(totalPartial) }
        ]);
        setLoading(false);
        setTimeout(() => setStartCounter(true), 500);
      }
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Calculate total
  const total = paymentsData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 shadow-md rounded border">
          <p className="font-semibold">{`${payload[0].name}: $${payload[0].value.toFixed(2)}`}</p>
          <p className="text-gray-600">{`${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Legend component
  const Legend = () => (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {paymentsData.map((entry, index) => (
        <div key={entry.name} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: COLORS[index] }}
          />
          <span className="text-sm">
            {entry.name} (${entry.value.toFixed(2)} - {((entry.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6  min-h-[440px] bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Payment Distribution</h2>
      <div className="w-full h-64 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={paymentsData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {paymentsData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-xl font-bold">
            $
            {startCounter ? (
              <CountUp
                start={0}
                end={total}
                duration={4}
                separator=","
                decimals={0}
                useEasing={true}
                delay={0}
                enableScrollSpy={false}
                scrollSpyDelay={0}
                scrollSpyOnce={true}
                useGrouping={true}
                easingFn={(t, b, c, d) => {
                  return c * (-Math.pow(2, -10 * t/d) + 1) * 1024 / 1023 + b;
                }}
              />
            ) : '0'}
          </p>
        </div>
      </div>
      <Legend />
    </div>
  );
};

export default PaymentsChart;
