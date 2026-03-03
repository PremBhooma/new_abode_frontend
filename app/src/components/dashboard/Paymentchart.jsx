import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Dashboardapi from '../api/Dashboardapi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Payments Chart',
    },
  },
};

const labels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from "@/components/ui/skeleton";



const Paymentchart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate year options (2020 to 2030)
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  useEffect(() => {
    fetchPaymentsDashboardData(selectedYear);
  }, [selectedYear]);

  const fetchPaymentsDashboardData = async (year) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await Dashboardapi.get(`get-payments-dashboard-data?year=${year}`);
      const data = response.data;

      if (data.status === 'error') {
        setErrorMessage(data.message || 'Error fetching data');
      } else {
        const monthlyAmounts = data.monthlyPayments || []; // Expected format: [0, 20000, 30000, ...] (length 12)
        setChartData({
          labels,
          datasets: [
            {
              fill: true,
              label: `Payments in ${year}`,
              data: monthlyAmounts,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setErrorMessage(error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white shadow-sm border border-neutral-200 h-full">
      <div className="w-full grid grid-cols-2 mb-6 items-center">
        <h2 className="col-span-1 text-lg font-semibold text-neutral-900">Revenue</h2>
        <div className="col-span-1">
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent className="border border-neutral-200">
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {chartData && <Line options={options} data={chartData} />}
    </div>
  );
};

export default Paymentchart;
