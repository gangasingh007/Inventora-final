import React, { useState, useEffect } from 'react';
import { Star, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'High-quality wireless headphones with noise cancellation',
    rating: 4.5,
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.pexels.com/photos/1537268/pexels-photo-1537268.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Feature-rich smartwatch with health tracking',
    rating: 4.8,
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Durable laptop backpack with multiple compartments',
    rating: 4.3,
    category: 'Accessories'
  },
  {
    id: '4',
    name: 'Coffee Maker',
    price: 79.99,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Automatic coffee maker with programmable settings',
    rating: 4.6,
    category: 'Appliances'
  },
  {
    id: '5',
    name: 'Running Shoes',
    price: 129.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Comfortable running shoes with excellent cushioning',
    rating: 4.7,
    category: 'Sports'
  },
  {
    id: '6',
    name: 'Desk Lamp',
    price: 39.99,
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Adjustable LED desk lamp with touch controls',
    rating: 4.4,
    category: 'Home'
  }
];

function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Inventora</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <div className="hero-stats">
              <div className="stat">
                <h3>1000+</h3>
                <p>Products</p>
              </div>
              <div className="stat">
                <h3>50k+</h3>
                <p>Customers</p>
              </div>
              <div className="stat">
                <h3>99%</h3>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked products just for you</p>
          </div>

          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button 
                      className="quick-add-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={!user}
                    >
                      <Plus size={20} />
                      {user ? 'Add to Cart' : 'Login to Add'}
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'filled' : ''}
                      />
                    ))}
                    <span>({product.rating})</span>
                  </div>
                  <div className="product-footer">
                    <span className="price">${product.price}</span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!user}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;