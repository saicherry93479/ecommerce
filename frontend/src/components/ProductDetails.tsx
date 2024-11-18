import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function ProductDetails({ 
  addToCart, 
  cart, 
  updateCartQuantity, 
  wishlist, 
  setWishlist 
}) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        console.log('response is ',response)
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isInWishlist = product && wishlist.some(item => item._id === product._id);
  const cartItem = product && cart.find(item => item._id === product._id);

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await axios.post('http://3.145.32.82:5000/api/wishlist/remove', { productId: product._id });
        setWishlist(wishlist.filter(item => item._id !== product._id));
      } else {
        await axios.post('http://3.145.32.82:5000/api/wishlist/add', { productId: product._id });
        setWishlist([...wishlist, product]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ac8e8e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-[#ac8e8e] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-gray-600 hover:text-[#ac8e8e] transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-8">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{product?.title}</h1>
                <button
                  onClick={handleWishlistToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={24}
                    className={`${
                      isInWishlist 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-3xl text-[#ac8e8e] font-bold">
                  ${product?.price?.toFixed(2)}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              <div className="mt-8">
                {cartItem ? (
                  <div className="flex items-center justify-start space-x-4">
                    <button
                      onClick={() => updateCartQuantity(product?._id, -1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <span className="text-xl font-medium text-gray-900">
                      {cartItem?.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product?._id, 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center w-full px-6 py-3 bg-[#ac8e8e] text-white rounded-lg hover:bg-[#9a7c7c] transition-colors"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                )}
              </div>

              {cartItem && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Total: ${(product?.price * cartItem?.quantity).toFixed(2)}
                  </p>
                </div>
              )}

              {product?.stock > 0 ? (
                <div className="mt-6">
                  <p className="text-sm text-green-600">
                    In Stock ({product?.stock} available)
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-sm text-red-600">Out of Stock</p>
                </div>
              )}

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-sm text-gray-600">
                    Category: <span className="font-medium">{product?.category}</span>
                  </li>
                  <li className="text-sm text-gray-600">
                    SKU: <span className="font-medium">{product?._id}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}