import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetch(`/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data))
        .catch(err => console.error("Failed to load cart", err));
    } else {
      setCart([]);
    }
  }, [isAuthenticated, user]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      const response = await fetch(`/api/cart/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: String(product.id),
          name: product.title || product.name || 'Product',
          price: product.price,
          image: product.image,
          quantity: quantity
        })
      });
      if (response.ok) {
        const updatedItem = await response.json();
        setCart(prevCart => {
          const exists = prevCart.find(item => item.id === updatedItem.id || item.productId === updatedItem.productId);
          if (exists) {
            return prevCart.map(item => item.productId === updatedItem.productId ? updatedItem : item);
          }
          return [...prevCart, updatedItem];
        });
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated) return;
    try {
      await fetch(`/api/cart/${user.id}/${id}`, { method: 'DELETE' });
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!isAuthenticated || quantity < 1) return;
    try {
      const response = await fetch(`/api/cart/${user.id}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (response.ok) {
        const updatedItem = await response.json();
        setCart(prevCart => prevCart.map(item => item.id === id ? updatedItem : item));
      }
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await fetch(`/api/cart/${user.id}/clear`, { method: 'DELETE' });
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
