import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import CountUp from 'react-countup';
import Link from 'next/link';
const COLORS = ["#2196F3", "#64B5F6", "#90CAF9", "#BBDEFB"]; // Different shades of blue

const PaymentsChart = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    const studentFeesRef = ref(database, 'studentFees');
    
    onValue(studentFeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Initialize an object to store totals by fee description
        const feeTypeTotals = {};

        // Process all student fees
        Object.values(data).forEach(studentFees => {
          if (studentFees) {
            Object.values(studentFees).forEach(fee => {
              const description = fee.description || 'Other';
              const paidAmount = fee.totalAmount - (fee.remainingAmount || 0);
              
              if (!feeTypeTotals[description]) {
                feeTypeTotals[description] = 0;
              }
              feeTypeTotals[description] += paidAmount;
            });
          }
        });

        // Convert to array format for the chart
        const chartData = Object.entries(feeTypeTotals)
          .map(([name, value]) => ({
            name,
            value: Math.round(value)
          }))
          .filter(item => item.value > 0) // Only show fee types with payments
          .sort((a, b) => b.value - a.value); // Sort by value descending

        setPaymentsData(chartData);
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
          <p className="font-semibold">{`${payload[0].name}: $${payload[0].value.toLocaleString()}`}</p>
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
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-sm">
            {entry.name} (${entry.value.toLocaleString()} - {((entry.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[300px] bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">
        <Link href="/finance" className="hover:text-blue-600 transition-colors">
          Fee Type Distribution
        </Link>
      </h2>
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
              />
            ) : '0'}
          </p>
        </div>
      </div>
      {/* <Legend /> */}
    </div>
  );
};

export default PaymentsChart;
