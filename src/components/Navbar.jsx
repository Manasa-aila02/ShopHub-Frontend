import { ShoppingCart, LogOut, Package, ShoppingBag } from 'lucide-react';
import { cartAPI } from '../api';
import { orderAPI } from '../api';


export default function Navbar({ user, cartCount, onLogout, onShowCart, onShowOrders, onCheckout, currentView, setCurrentView }) {
  const handleCartClick = async () => {
    try {
      const response = await cartAPI.getCart();
      const cart = response.data;

      if (!cart?.items?.length) {
        alert('Cart is empty');
      } else {
        const message = cart.items
          .map(
            (item, index) =>
              `Item ${index + 1}: Cart ID: ${cart._id}, Item ID: ${item.item._id}`
          )
          .join('\n');

        alert(`Cart Items:\n${message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch cart items');
    }

     onShowCart();
  };

  const handleOrdersClick = async () => {
  try {
    const response = await orderAPI.getOrders();
    const orders = response.data;

    if (!orders || orders.length === 0) {
      alert('No orders found');
    } else {
      const message = orders
        .map((order, index) => `Order ${index + 1}: ${order._id}`)
        .join('\n');

      alert(`Order History:\n${message}`);
    }
  } catch (error) {
    console.error(error);
    alert('No orders found');
  }

  onShowOrders();
};


  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('shop')}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ShopHub</h1>
              <p className="text-xs text-purple-200">Welcome, {user.username}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('shop')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === 'shop'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Shop
            </button>

            <button
                onClick={onCheckout}
                // disabled={cartCount === 0}
                className={`relative px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                currentView === 'cart'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
              >
                Checkout
              </button>

            
            <button
              // onClick={onShowCart}
              onClick={handleCartClick}
              className={`relative px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                currentView === 'cart'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={handleOrdersClick}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                currentView === 'orders'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-5 h-5" />
              Orders
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
