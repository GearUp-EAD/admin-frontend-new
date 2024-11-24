import { useState, useEffect } from 'react';

export const useCustomers = () => {
  const [recentCustomers] = useState([
    {
      name: 'Johnson D.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      name: 'Dianne I.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Penny L.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
      name: 'Evan M.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Simulating API call
    const fetchCustomers = async () => {
      // const response = await fetch('/api/recent-customers');
      // const data = await response.json();
      // setRecentCustomers(data);
    };

    fetchCustomers();
  }, []);

  return { recentCustomers };
};