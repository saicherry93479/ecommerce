import React from "react";
import { ShoppingCart, X, Heart } from "lucide-react";
import axios from "axios";

export default function Wishlist({ wishlist, setWishlist, addToCart }) {
  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(
        `http://3.145.32.82:5000/api/wishlist/remove/${id}`
      );
      setWishlist(wishlist.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const moveToCart = async (item) => {
    try {
      await axios.post("http://3.145.32.82:5000/api/cart/add", {
        productId: item._id,
        quantity: 1,
      });
      await removeFromWishlist(item._id);
      addToCart(item);
    } catch (error) {
      console.error("Error moving item to cart:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-xl text-gray-600">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-contain mx-auto mb-4"
                />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => moveToCart(item)}
                  className="flex items-center space-x-2 bg-[#ac8e8e] text-white px-4 py-2 rounded-lg hover:bg-[#9a7c7c] transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
