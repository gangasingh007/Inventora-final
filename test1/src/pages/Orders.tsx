import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'processing':
        return <Package className="status-icon processing" />;
      case 'shipped':
        return <Package className="status-icon shipped" />;
      case 'delivered':
        return <CheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
      default:
        return <Clock className="status-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <Package size={80} className="empty-icon" />
            <h2>No orders yet</h2>
            <p>Your orders will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Total: ${order.total.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;