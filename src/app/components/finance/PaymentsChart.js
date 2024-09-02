import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PaymentsChart = ({ payments }) => {
  // Use payment methods as labels
  const labels = payments.map((payment) => payment.paymentMethod);
  const dataValues = payments.map((payment) => payment.amount);

  // Generate random colors for each bar
  const backgroundColors = payments.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Payment Method',
        data: dataValues,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: $${context.raw}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default PaymentsChart;
