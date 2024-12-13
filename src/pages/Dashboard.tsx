import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PopularProducts from '../components/PopularProducts';
import { useStats } from '../hooks/useStats';
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';


interface Customer {
  customerID: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: number;
  imageUrl: string;
}
const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);

  const fetchChartData = async () => {
    fetch("http://localhost:33000/api/payments/paymentSummary")
    .then((response) => response.json())
    .then((data) => {
      const formattedData = data.map((item) => ({
        name: new Date(0, item.month - 1).toLocaleString("default", { month: "long" }),
        value: item.totalAmount,
      }));
      setChartData(formattedData);
    })
    .catch((error) => console.error("Error fetching payment summary:", error));
  }

  const fetchTotalIncome = async () => {
    try {
      const response = await fetch('http://localhost:33000/api/payments/total');
      const data = await response.json();
      setTotalIncome(data || 0);

    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  const fetchFirstFiveCustomers = async () => {
    try {
      const response = await fetch('http://localhost:33000/api/customers/first-five');
      const data = await response.json();
      setRecentCustomers(data || []);
    } catch (error) {
      console.error('Error fetching first five customers:', error);
    }
  }

  useEffect(() => {
    fetchChartData();
    fetchFirstFiveCustomers ();
    fetchTotalIncome();
  }, []);


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-semibold">${totalIncome.toLocaleString()}</p>
              </div>
          </div>
        </div>
        {/* <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Monthly Growth</p>
              <p className="text-2xl font-semibold">+8.5%</p>
            </div>
          </div>
        </div> */}
      </div>

      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Our New Customers</h3>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {recentCustomers.map((customer) => (
            <div key={customer.name} className="text-center flex-shrink-0">
              <img
                src={customer.imageUrl}
                alt={customer.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <p className="text-sm text-gray-600">{customer.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      {/* <div className="mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Popular Products</h3>
          <div className="space-y-4">
            <PopularProducts />
          </div>
        </div>
      </div> */}

      {/* Total Income Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Total Income</h3>
          <select className="px-3 py-2 border rounded-lg">
            <option>All Time</option>
            <option>Last Month</option>
            <option>Last Week</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
        <LineChart width={800} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8B4513"
        strokeWidth={2}
        dot={{ fill: "#8B4513" }}
      />
    </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
