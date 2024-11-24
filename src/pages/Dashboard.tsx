import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import PopularProducts from '../components/PopularProducts';
import { useStats } from '../hooks/useStats';
import { useCustomers } from '../hooks/useCustomers';

const Dashboard = () => {
  const { stats, data: chartData } = useStats();
  const { recentCustomers } = useCustomers();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="text-lg font-semibold mb-2">Customers</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">{stats.customers}</span>
            <span className="text-green-500 text-sm">↑ 8%</span>
          </div>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold mb-2">Income</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold">${stats.income}</span>
            <span className="text-green-500 text-sm">↑ 8%</span>
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Welcome to our new online experience</h3>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {recentCustomers.map((customer) => (
            <div key={customer.name} className="text-center flex-shrink-0">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-16 h-16 rounded-full mb-2"
              />
              <p className="text-sm text-gray-600">{customer.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="mb-8">
        <PopularProducts />
      </div>

      {/* Revenue Chart */}
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
              dot={{ fill: '#8B4513' }}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;