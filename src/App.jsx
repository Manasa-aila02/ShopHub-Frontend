import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import ItemList from './components/ItemList';
import Cart from './components/Cart';
import Orders from './components/Orders';
import { userAPI, cartAPI, orderAPI } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('shop');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      updateCartCount();
    }
  }, []);

  const updateCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      const count = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    updateCartCount();
  };

  const handleLogout = async () => {
    try {
      await userAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentView('shop');
      setCartCount(0);
    }
  };
  

  const handleNavbarCheckout = async () => {
  try {
    // Get the current cart
    const response = await cartAPI.getCart();
    const cart = response.data;

    if (!cart?.items?.length) {
      alert('Cart is empty. Add items to checkout.');
      return;
    }

    // Create order
    const res = await orderAPI.createOrder();
    const orderId = res?.data?.order?._id;

    alert(`Order placed successfully!${orderId ? `\nOrder ID: ${orderId}` : ''}`);

    // alert(`Order placed successfully!\nOrder ID: ${res.data.orderId}`);
//     alert(
//   `Order placed successfully!` +
//   (res?.data?.orderId ? `\nOrder ID: ${res.data.orderId}` : '')
// );


    // Updates cart count after checkout
    updateCartCount();

    // Optionally, navigates to orders page
    setCurrentView('orders');

  } catch (error) {
    console.error('Navbar checkout error:', error);
    alert(error.response?.data?.error || 'Failed to place order');
  }
};


  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        cartCount={cartCount}
        onLogout={handleLogout}
        onShowCart={() => setCurrentView('cart')}
        onShowOrders={() => setCurrentView('orders')}
        onCheckout={handleNavbarCheckout}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main>
        {currentView === 'shop' && (
          <ItemList onCartUpdate={updateCartCount} />
        )}
        
        {currentView === 'cart' && (
          <Cart
            onCartUpdate={updateCartCount}
            onCheckout={() => setCurrentView('orders')}
          />
        )}
        
        {currentView === 'orders' && <Orders />}
      </main>
    </div>
  );
}

export default App;
