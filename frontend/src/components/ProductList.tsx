import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Plus, Minus, Filter } from "lucide-react";
import axios from "axios";

export default function ProductList({
  addToCart,
  updateCartQuantity,
  cart,
  wishlist,
  setWishlist,
  searchTerm,
}) {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        console.log("response is ", response);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const handleWishlistToggle = async (product) => {
    try {
      if (isInWishlist(product._id)) {
        await axios.delete(
          `http://localhost:5000/api/wishlist/remove/${product._id}`
        );
        setWishlist(wishlist.filter((item) => item._id !== product._id));
      } else {
        await axios.post(
          `http://localhost:5000/api/wishlist/add/${product._id}`
        );
        setWishlist([...wishlist, product]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const filterBySearchTerm = (product) => {
    return product.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filterByPrice = (product) => {
    return (
      product.price >= (minPrice === "" ? 0 : minPrice) &&
      product.price <= (maxPrice === "" ? Infinity : maxPrice)
    );
  };

  const filteredProducts = products.filter(
    (product) => filterBySearchTerm(product) && filterByPrice(product)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getCartItem = (productId) => {
    return cart.find((item) => item._id === productId);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-16"
          } bg-white shadow-lg transition-all duration-300 p-4`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <Filter size={20} />
          </button>

          {isSidebarOpen && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter by Price
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ac8e8e]"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ac8e8e]"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-gray-600">
              Showing {currentProducts.length} of {filteredProducts.length}{" "}
              products
            </p>
          </div>

          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-xl text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => {
                const cartItem = getCartItem(product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative p-4">
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Heart
                          size={24}
                          className={`transition-colors ${
                            isInWishlist(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      <div className="block">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-48 h-48 object-contain mx-auto mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {product.title}
                        </h3>
                        <p className="text-[#ac8e8e] font-bold">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4">
                        {cartItem ? (
                          <div className="flex items-center justify-center space-x-4">
                            <button
                              onClick={() => updateCartQuantity(product._id,false)}
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <Minus size={20} />
                            </button>
                            <span className="text-lg font-semibold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(product._id)
                              }
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-[#ac8e8e] text-white py-2 rounded-md hover:bg-[#9a7c7c] transition-colors flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart size={20} />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <p className="text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === number
                        ? "bg-[#ac8e8e] text-white border-[#ac8e8e]"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
