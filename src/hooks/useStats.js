import { useState, useEffect } from 'react';

export const useStats = () => {
  const [stats, setStats] = useState({
    customers: 10243,
    income: 39403450,
  });

  const [data, setData] = useState([
    { name: 'Jan', value: 30000 },
    { name: 'Feb', value: 32000 },
    { name: 'Mar', value: 35000 },
    { name: 'Apr', value: 37000 },
    { name: 'May', value: 34000 },
    { name: 'Jun', value: 39000 },
    { name: 'Jul', value: 38000 },
    { name: 'Aug', value: 40000 },
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulating API call
    const fetchStats = async () => {
      // const response = await fetch('/api/stats');
      // const data = await response.json();
      // setStats(data);
    };

    fetchStats();
  }, []);

  return { stats, data };
};