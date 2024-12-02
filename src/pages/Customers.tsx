import React from 'react';
import { Mail, Phone, MoreVertical } from 'lucide-react';
import { useState,useEffect } from 'react';

interface Customer {
  customerID: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  imageUrl?: string; // Optional property
}
const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});
  const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/customers');
        const data = await response.json();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  

    const getOrderCounts = async () => {
      const counts: { [key: string]: number } = {};
      for (const customer of customers) {
        counts[customer.customerID] = await fetchOrderCount(customer.customerID);
      }
      setOrderCounts(counts);
    };

    const getTotalAmounts = async () => {
      const amounts: { [key: string]: number } = {};
      for (const customer of customers) {
        amounts[customer.customerID] = await fetchTotalAmount(customer.customerID);
      }
      setTotalAmounts(amounts);
    };
  
    if (customers.length > 0) {
      getTotalAmounts();
    }
  
    if (customers.length > 0) {
      getOrderCounts();
    }

    fetchCustomers();
  }, [customers]);

  const fetchOrderCount = async (customerId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/customer/${customerId}`);
      const data = await response.json();
      return data.length; // Assuming the API returns an array of orders
    } catch (error) {
      console.error('Error fetching orders:', error);
      return 0;
    }
  };

  const fetchTotalAmount = async (customerId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/totalAmount/${customerId}`);
      const amount = await response.json();
      console.log(amount);
      return amount;
    } catch (error) {
      console.error('Error fetching total amount:', error);
      return 0;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customers</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.customerID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={customer.imageUrl}
                        alt={customer.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {customer.phoneNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {orderCounts[customer.customerID] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${totalAmounts[customer.customerID]?.toFixed(2) || '0.00'}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;