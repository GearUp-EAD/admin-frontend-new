import React from "react";
import { Package, Eye } from "lucide-react";
import { useState, useEffect } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface OrderItem {
  orderItemID: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariantId: string;
}

interface Order {
  orderID: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  customerId: string;
  orderItems: OrderItem[];
}

interface Customer {
  customerID: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: number;
  imageUrl: string | null;
}

interface Shipping {
  shippingID: string;
  shippingDate: string | null;
  shippingAddress: string;
  shippingStatus: string;
  order: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<{
    [key: string]: Customer;
  }>({});
  const [shippingDetail, setShippingDetail] = useState<{
    [key: string]: Shipping;
  }>({});
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [orderCounts, setOrderCounts] = useState({
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Type assertion to tell TypeScript that target is an Element
      const target = event.target as Element;
      if (!target.closest(".relative")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchShippingDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/shippings");
      if (!response.ok) {
        throw new Error("Failed to fetch shipping details");
      }
      const data = await response.json();
      calculateOrderCounts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching shipping details:", err);
    }
  };
  // Fetch orders once when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchShippingDetails();
  }, []); // Empty dependency array ensures this runs only once

  // Fetch customer details when orders change
  useEffect(() => {
    if (orders.length === 0) return;

    const loadCustomerDetails = async () => {
      const details: { [key: string]: Customer } = {};
      for (const order of orders) {
        const customer = await fetchCustomerDetails(order.customerId);
        if (customer) {
          details[order.customerId] = customer;
        }
      }
      setCustomerDetails(details);
    };

    loadCustomerDetails();
  }, [orders]);

  // Fetch shipping details when orders change
  useEffect(() => {
    if (orders.length === 0) return;

    const loadShippingDetails = async () => {
      const details: { [key: string]: Shipping } = {};
      for (const order of orders) {
        const shipping = await fetchShippingDetail(order.orderID);
        if (shipping) {
          details[order.orderID] = shipping;
        }
      }
      setShippingDetail(details);
    };

    loadShippingDetails();
  }, [orders]);

  const fetchCustomerDetails = async (customerId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/customers/${customerId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  };

  const fetchShippingDetail = async (orderId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/shippings/order/${orderId}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching shipping details:", error);
      return null;
    }
  };

  const calculateOrderCounts = (shippingDetails: Shipping[]) => {
    const counts = {
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    shippingDetails.forEach((shippingDetails) => {
      switch (shippingDetails.shippingStatus) {
        case "PROCESSING":
          counts.processing++;
          break;
        case "SHIPPED":
          counts.shipped++;
          break;
        case "DELIVERED":
          counts.delivered++;
          break;
      }
    });

    setOrderCounts(counts);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    // Get current status for comparison
    const currentStatus = shippingDetail[orderId]?.shippingStatus || 'PENDING';
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to change the status from ${currentStatus} to ${status}?`
    );

    if (!confirmed) {
      setDropdownOpen(null); // Close dropdown if cancelled
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/shippings/order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shippingStatus: status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipping status");
      }

      // Update the local state with the new status
      const updatedShippingDetail = { ...shippingDetail };
      updatedShippingDetail[orderId] = {
        ...updatedShippingDetail[orderId],
        shippingStatus: status,
      };
      setShippingDetail(updatedShippingDetail);
      fetchShippingDetails();
    } catch (error) {
      console.error("Error updating shipping status:", error);
      alert("Failed to update shipping status.");
    } finally {
      setDropdownOpen(null);
    }
};

  return (
    <div>
      {/* Render UI */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Orders</h2>
              <div className="flex space-x-4">
                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#543310]">
                  <option>All Orders</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold">{orders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-2xl font-semibold">
                      {orderCounts.processing}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Shipped</p>
                    <p className="text-2xl font-semibold">
                      {orderCounts.shipped}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Dilivered</p>
                    <p className="text-2xl font-semibold">
                      {orderCounts.delivered}
                    </p>
                  </div>
                </div>
              </div>
            </div>

<div className="bg-white rounded-xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.orderID}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={
                                customerDetails[order.customerId]?.imageUrl ||
                                "/default-avatar.png"
                              }
                              alt={`${
                                customerDetails[order.customerId]?.name ||
                                "Customer"
                              } profile`}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customerDetails[order.customerId]?.name ||
                                  "Loading..."}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rs {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {shippingDetail[order.orderID]?.shippingStatus ||
                              "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shippingDetail[order.orderID]?.shippingAddress ||
                            "No address"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                          <div className="relative">
                            <button
                              className="inline-flex items-center px-3 py-2 border border-[#543310] rounded-md
                                          bg-white text-[#543310] hover:bg-[#543310] hover:text-white
                                          transition-colors duration-200 ease-in-out
                                          focus:outline-none focus:ring-2 focus:ring-[#543310] focus:ring-opacity-50"
                              onClick={() => setDropdownOpen(order.orderID)}
                            >
                              Update Status
                            </button>
                            {dropdownOpen === order.orderID && (
                              <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                  {["PROCESSING", "SHIPPED", "DELIVERED"].map(
                                    (status) => (
                                      <li key={status}>
                                        <button
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#543310] hover:text-white transition-colors duration-150 ease-in-out"
                                          onClick={() =>
                                            handleUpdateStatus(
                                              order.orderID,
                                              status
                                            )
                                          }
                                        >
                                          {status}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
