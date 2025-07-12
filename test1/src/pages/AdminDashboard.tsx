import  { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname.split('/admin')[1] || '';

  const navItems = [
    { path: '', label: 'Overview', icon: BarChart3 },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={`/admin${item.path}`}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}

function AdminOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="admin-overview">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>${analytics.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon growth">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{analytics.monthlyGrowth}%</h3>
            <p>Monthly Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage all users in the system</p>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon edit">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminOrders() {
  return (
    <div className="admin-orders">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>View and manage all orders</p>
      </div>
      <div className="coming-soon">
        <h3>Order management coming soon</h3>
      </div>
    </div>
  );
}

function AdminProducts() {
  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Product Management</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Product
        </button>
      </div>
      <div className="coming-soon">
        <h3>Product management coming soon</h3>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="admin-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage application settings</p>
      </div>
      <div className="coming-soon">
        <h3>Settings panel coming soon</h3>
      </div>
    </div>
  );
}

export default AdminDashboard;