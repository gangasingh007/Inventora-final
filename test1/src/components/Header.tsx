import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <Package className="logo-icon" />
          <span>Inventora</span>
        </Link>

        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          {user && (
            <>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
              )}
            </>
          )}
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              <Link to="/cart" className="cart-button">
                <ShoppingCart size={20} />
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </Link>
              <div className="user-menu">
                <User size={20} />
                <span>{user.name}</span>
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;