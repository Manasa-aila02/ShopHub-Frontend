import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { cartAPI, orderAPI } from '../api';

export default function Cart({ onCartUpdate, onCheckout }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
      onCartUpdate();
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartAPI.updateQuantity(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) return;
    
    setCheckingOut(true);
    try {
      const res = await orderAPI.createOrder();
      await fetchCart();
      onCheckout();
      // alert(`Order placed successfully!\nOrder ID: ${res.orderId}`);
        alert(
      `Order placed successfully!` +
      (res?.orderId ? `\nOrder ID: ${res.orderId}` : '')
    );
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.error || 'Failed to create order');
    } finally {
      setCheckingOut(false);
    }
  };


//   const handleCheckout = async () => {
//   if (!cart?.items?.length) {
//     alert('Cart is empty. Add items to cart to order.');
//     return;
//   }

//   setCheckingOut(true);

//   try {
//     const res = await orderAPI.createOrder();

//     alert(`Order placed successfully!\nOrder ID: ${res.data.orderId}`);

//     await fetchCart();   // clears cart
//     onCartUpdate();      // updates navbar count
//     onCheckout();        // navigate AFTER alert

//   } catch (error) {
//     console.error('Error creating order:', error);
//     alert(error.response?.data?.error || 'Failed to create order');
//   } finally {
//     setCheckingOut(false);
//   }
// };

  

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600">Start shopping to add items to your cart!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((cartItem) => (
            <div
              key={cartItem.item._id}
              className="bg-white rounded-2xl shadow-md p-6 flex gap-6 hover:shadow-lg transition-shadow"
            >
              <img
                src={cartItem.item.image}
                alt={cartItem.item.name}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {cartItem.item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  ${cartItem.item.price} each
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-12 text-center font-semibold">
                    {cartItem.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRemoveItem(cartItem.item._id)}
                    className="ml-auto text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-purple-600">
                  ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {checkingOut ? 'Processing...' : (
                <>
                  Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
