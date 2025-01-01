// components/GenderDonutChart.jsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { database } from '../../../../../utils/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import CountUp from 'react-countup';

const COLORS = ["#2196F3", "#64B5F6", "#90CAF9", "#BBDEFB"]; // Different shades of blue from darker to lighter

const GenderDonutChart = () => {
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    const userTypesRef = ref(database, 'userTypes');
    
    onValue(userTypesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let maleCount = 0;
        let femaleCount = 0;

        Object.values(data).forEach(user => {
            if (user.gender === 'Male') {
              maleCount++;
            } else if (user.gender === 'Female') {
              femaleCount++;
            }
        });

        setGenderData([
          { name: "Male", value: maleCount },
          { name: "Female", value: femaleCount }
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
  const total = genderData.reduce((sum, entry) => sum + entry.value, 0);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 shadow-md rounded border">
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-gray-600">{`${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Legend component
  const Legend = () => (
    <div className="flex justify-center gap-6 mt-4">
      {genderData.map((entry, index) => (
        <div key={entry.name} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: COLORS[index] }}
          />
          <span className="text-sm">
            {entry.name} ({entry.value} - {((entry.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center  min-h-[300px] p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Gender Distribution</h2>
      <div className="w-full h-64 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {genderData.map((entry, index) => (
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
          <p className="text-sm font-medium text-gray-600">Total Accounts</p>
          <p className="text-xl font-bold">
            {startCounter ? (
              <CountUp
                start={0}
                end={total}
                duration={4}
                separator=","
                useEasing={true}
                decimals={0}
                decimal=","
                delay={0}
                enableScrollSpy={false}
                scrollSpyDelay={0}
                scrollSpyOnce={true}
                useGrouping={true}
                easingFn={(t, b, c, d) => {
                  // Custom easing function for smoother animation
                  // t: current time, b: beginning value, c: change in value, d: duration
                  return c * (-Math.pow(2, -10 * t/d) + 1) * 1024 / 1023 + b;
                }}
              />
            ) : '0'}
          </p>
        </div>
      </div>
      {/* <Legend /> */}
    </div>
  );
};

export default GenderDonutChart;
