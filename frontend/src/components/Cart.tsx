import React from "react";
import { Plus, Minus, ShoppingCart, Heart, Trash } from "lucide-react";
import axios from "axios";

export default function Cart({ cart, setCart, addToWishlist }) {
  console.log("cart ", cart);
  const increaseQuantity = async (id) => {
    try {
      const resp = await axios.post("http://3.145.32.82:5000/api/cart/add", {
        productId: id,
        quantity: 1,
      });
      console.log("resp ", resp);
      setCart(
        cart.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cart.find((item) => item._id === id);
    if (!item) return;

    if (item.quantity === 1) {
      removeFromCart(id);
    } else {
      try {
        await axios.post("http://3.145.32.82:5000/api/cart/add", {
          productId: id,
          quantity: -1,
        });
        setCart(
          cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const removeFromCart = async (id, all = false) => {
    try {
      const resp = await axios.post(
        `http://3.145.32.82:5000/api/cart/remove/${id}`,
        { removeAll: all }
      );
      console.log("resp ", resp);
      setCart(cart.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const moveToWishlist = async (item) => {
    try {
      await axios.post("http://3.145.32.82:5000/api/wishlist/add", {
        productId: item._id,
      });
      removeFromCart(item._id);
      addToWishlist(item);
    } catch (error) {
      console.error("Error moving item to wishlist:", error);
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <div className="text-2xl font-bold text-[#ac8e8e]">
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="w-32 h-32 object-contain mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.product?.title}
              </h3>
              <p className="text-gray-600 mb-2">${item.product?.price} </p>
              <p className="text-[#ac8e8e] font-semibold mb-4">
                {/* Total: ${item.price.toFixed(2)} */}
              </p>

              <div className="flex justify-center items-center space-x-4 mb-4">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus size={20} />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => removeFromCart(item._id, true)}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash size={20} />
                  <span>Remove</span>
                </button>
                <button
                  onClick={() => moveToWishlist(item)}
                  className="flex items-center space-x-2 bg-[#ac8e8e] text-white px-4 py-2 rounded-lg hover:bg-[#9a7c7c] transition-colors"
                >
                  <Heart size={20} />
                  <span>Move to Wishlist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
