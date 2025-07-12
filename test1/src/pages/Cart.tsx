import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [ecoDelivery, setEcoDelivery] = useState(true);
const [couponCode, setCouponCode] = useState('');


  const handleCheckout = async () => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/orders/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ecoDelivery,
        couponCode: couponCode || null
      })
    });

    const data = await response.json();

    if (response.ok) {
      clearCart();
      navigate('/orders');
      alert(data.message || 'Order placed successfully!');
    } else {
      alert(data.message || 'Checkout failed.');
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  } finally {
    setLoading(false);
  }
};



  if (items.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <ShoppingBag size={80} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{items.length} items in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="eco-delivery-toggle">
  <label>
    <input
      type="checkbox"
      checked={ecoDelivery}
      onChange={() => setEcoDelivery(!ecoDelivery)}
    />
    Eco-Friendly Delivery 🌱
  </label>
</div>

<div className="coupon-code">
  <input
    type="text"
    placeholder="Enter coupon code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
  />
</div>


          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-primary btn-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;