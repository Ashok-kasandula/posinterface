import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

const services = [
  { id: 1, name: 'Fitness Class', price: 50 },
  { id: 2, name: 'Therapy Session', price: 75 },
  { id: 3, name: 'Workshop', price: 100 },
];

function ServiceList({ services, addToCart }) {
  const [lastAddedServiceId, setLastAddedServiceId] = useState(null);

  const handleAddToCart = (service) => {
    addToCart(service);
    setLastAddedServiceId(service.id);
    
    setTimeout(() => {
      setLastAddedServiceId(null);
    }, 1000);
  };

  return (
    <section className="service-list">
      <h2 className="section-title">Services</h2>
      <ul className="service-items">
        {services.map((service) => (
          <li 
            key={service.id} 
            className={`service-item ${lastAddedServiceId === service.id ? 'service-item-added' : ''}`}
          >
            <span>{service.name}</span>
            <span>₹{service.price}</span>
            <button 
              className="btn-add" 
              onClick={() => handleAddToCart(service)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cart({ cart, updateCart, removeFromCart }) {
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    } else {
      alert('Cart is empty. Please add services first.');
    }
  };

  return (
    <section className="cart">
      <h2 className="section-title">Cart</h2>
      <ul className="cart-items">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <span>{item.name}</span>
            <input
              type="number"
              className="quantity-input"
              value={item.quantity}
              onChange={(e) => updateCart(item.id, parseInt(e.target.value, 10))}
            />
            <span>₹{item.price * item.quantity}</span>
            <button
              className="btn-remove"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3 className="total">
        Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </h3>
      <button 
        className="btn-proceed" 
        onClick={proceedToCheckout}
      >
        Proceed to Checkout
      </button>
    </section>
  );
}

function Checkout({ customer, setCustomer, handleCheckout, cart }) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const completeCheckout = () => {
    if (!customer.name || !customer.email || !customer.phone) {
      alert('Please fill in all customer details.');
      return;
    }

    handleCheckout();
    navigate('/receipt');
  };

  return (
    <section className="checkout">
      <h2 className="section-title">Checkout</h2>
      <div className="checkout-summary">
        <div className="cart-summary">
          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x {item.quantity}</span>
              <span className="item-price">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <h3 className="total">
          Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        </h3>
      </div>
      <div className="customer-form">
        <h3>Customer Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input"
          value={customer.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          value={customer.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="input"
          value={customer.phone}
          onChange={handleChange}
        />
      </div>
      <button className="btn-checkout" onClick={completeCheckout}>
        Complete Checkout
      </button>
    </section>
  );
}

function Receipt({ receipt }) {
  return (
    <section className="receipt">
      <h2 className="section-title">Receipt</h2>
      <p>Customer: {receipt.customer.name}</p>
      <p>Email: {receipt.customer.email}</p>
      <p>Phone: {receipt.customer.phone}</p>
      <ul className="receipt-items">
        {receipt.items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} = ₹{item.price * item.quantity}
          </li>
        ))}
      </ul>
      <h3 className="total">Total: ₹{receipt.total}</h3>
    </section>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [receipt, setReceipt] = useState(null);

  const addToCart = (service) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === service.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...service, quantity: 1 }];
    });
  };

  const updateCart = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!customer.name || !customer.email || !customer.phone) {
      alert('Please fill in all customer details.');
      return;
    }

    setReceipt({
      customer,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });

    setCart([]);
    setCustomer({ name: '', email: '', phone: '' });
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1 className="title">Service Sphere</h1>
          <nav className="menu-bar">
            <ul className="menu-links">
              <li>
                <Link to="/">Services</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
              {receipt && (
                <li>
                  <Link to="/receipt">Receipt</Link>
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<ServiceList services={services} addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  updateCart={updateCart}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  customer={customer}
                  setCustomer={setCustomer}
                  handleCheckout={handleCheckout}
                  cart={cart}
                />
              }
            />
            <Route
              path="/receipt"
              element={receipt && <Receipt receipt={receipt} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;