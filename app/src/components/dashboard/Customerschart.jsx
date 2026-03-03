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

// Register chart.js components
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

// Static month labels
const labels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Function to generate chart options with dynamic max value
const getChartOptions = (maxValue = 10) => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Customers Chart',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: maxValue,
      ticks: {
        stepSize: 1,
        callback: (value) => (Number.isInteger(value) ? value : null),
      },
    },
  },
});

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from "@/components/ui/skeleton";

const Customerschart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(getChartOptions());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate year options (2020 to 2030)
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  const fetchCustomersDashboardData = async (year) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await Dashboardapi.get(`get-customers-dashboard-data?year=${year}`);
      const data = response.data;

      if (data.status === 'error') {
        setErrorMessage(data.message || 'Error fetching data');
      } else {
        const monthlyAmounts = data.monthlyCustomers || [];

        // Calculate a rounded-up max value for Y-axis
        const maxValue = Math.max(...monthlyAmounts);
        const roundedMax = Math.ceil(maxValue / 10) * 10 || 10;

        // Set chart data and options
        setChartData({
          labels,
          datasets: [
            {
              fill: true,
              label: `Customers in ${year}`,
              data: monthlyAmounts,
              borderColor: '#de66d2',
              backgroundColor: '#e8a7e2',
            },
          ],
        });

        setChartOptions(getChartOptions(roundedMax));
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setErrorMessage(error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersDashboardData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="p-5 rounded-xl bg-white shadow-sm border border-neutral-200 h-full">
      <div className="w-full grid grid-cols-2 mb-6 items-center">
        <h2 className="col-span-1 text-lg font-semibold text-neutral-900">New Customers</h2>
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
      {chartData && <Line options={chartOptions} data={chartData} />}
    </div>
  );
};

export default Customerschart;
