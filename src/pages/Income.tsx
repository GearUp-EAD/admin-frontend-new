import React from 'react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';


const monthlyData = [
  { month: 'Jan', income: 30000 },
  { month: 'Feb', income: 32000 },
  { month: 'Mar', income: 35000 },
  { month: 'Apr', income: 37000 },
  { month: 'May', income: 34000 },
  { month: 'Jun', income: 39000 },
];

interface Transaction {
  id: number;
  customer: string;
  image: string;
  date: string;
  amount: number;
  method: string;
}

interface InputData {
  0: string; 
  1: string; 
  2: string; 
  3: number;  
  4: string; 
}

interface GrowthData {
  date: string;
  growth: number | null;
}

const Income = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<string>('0');
  const [growthColor, setGrowthColor] = useState<string>('text-gray-600');
  const [avgOrderValue, setAvgOrderValue] = useState<number>(0);



  const calculateAvgOderValue = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      const oderCount = data.length;
      const response1 = await fetch('http://localhost:8080/api/payments/total');
      const data1 = await response1.json();
      const totalIncome = data1;
      try {
      setAvgOrderValue(totalIncome/oderCount);
      }
      catch (error) {
        setAvgOrderValue(0);
      }
    }
    catch (error) {
      console.error('Error fetching total income:', error);
    }
  }


  const fetchChartData = async () => {
    fetch("http://localhost:8080/api/payments/paymentSummary")
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
      const response = await fetch('http://localhost:8080/api/payments/total');
      const data = await response.json();
      setTotalIncome(data || 0);

    } catch (error) {
      console.error('Error fetching total income:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payments/latestFiveTransactions');
      const data = await response.json();

      const transactions: Transaction[] = data.map((item: InputData, index: number) => ({
        id: index + 1,
        customer: item[0],
        image: item[1],
        date: item[2],
        amount: item[3],
        method: item[4]
      }));

      setTransactions(transactions || []);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  }
  const fetchGrowthData = async (): Promise<GrowthData[]> => {
    const response = await fetch('http://localhost:8080/api/payments/MonthlyPaymentGrowth');
    const data: [string, number | null][] = await response.json();
    
    return data.map(([date, growth]) => ({
      date,
      growth
    }));
  };

  const getGrowthData = async () => {
    try {
      const growthData = await fetchGrowthData();
      // Get last non-null growth value
      const lastGrowth = [...growthData]
        .reverse()
        .find(item => item.growth !== null);
      
      if (lastGrowth && lastGrowth.growth !== null) {
        const growthValue = lastGrowth.growth;
        setMonthlyGrowth(`${growthValue > 0 ? '+' : ''}${growthValue.toFixed(2)}%`);
        setGrowthColor(growthValue > 0 ? 'text-green-600' : 'text-red-600');
      }
    } catch (error) {
      console.error('Error fetching growth data:', error);
      setMonthlyGrowth('N/A');
    }
  };

  useEffect(() => {
    calculateAvgOderValue();
    getGrowthData();
    fetchTransactions();
    fetchTotalIncome();
    fetchChartData();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Income</h2>
        <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543310]">
          <option>Last 6 Months</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Monthly Growth</p>
              <p className={`text-2xl font-semibold ${growthColor}`}>
              {monthlyGrowth}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-semibold">${avgOrderValue.toFixed()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Income Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#543310"
                  strokeWidth={2}
                  dot={{ fill: '#543310' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={transaction.image}
                    alt={transaction.customer}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.method}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;