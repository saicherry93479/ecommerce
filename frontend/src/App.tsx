import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
// Components
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token is ", token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }

    // axios.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     if (error.response?.status === 401) {
    //       localStorage.removeItem("token");
    //       setIsAuthenticated(false);
    //       delete axios.defaults.headers.common["Authorization"];
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }, []);

  // Fetch user's cart and wishlist
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const [cartRes, wishlistRes] = await Promise.all([
            axios.get("http://localhost:5000/api/cart"),
            axios.get("http://localhost:5000/api/wishlist"),
          ]);
          setCart(cartRes.data);
          setWishlist(wishlistRes.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      // Store the intended action for after login
      localStorage.setItem(
        "pendingAction",
        JSON.stringify({
          type: "ADD_TO_CART",
          product,
        })
      );
      return <Navigate to="/login" />;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateCartQuantity = async (id, increase = true) => {
    try {
      const product = cart.find((item) => item._id === id);
      if (product.quantity > 1) {
      }
      if (increase) {
        const resp = await axios.post("http://localhost:5000/api/cart/add", {
          productId: id,
          quantity: 1,
        });
        console.log("resp ", resp);
        setCart(
          cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        if (cart.find((item) => item._id === id).quantity === 1) {
          const resp = await axios.post(
            `http://localhost:5000/api/cart/remove/${id}`,
            { removeAll: true }
          );
          setCart(cart.filter((item) => item._id !== id));
        } else {
          await axios.post("http://localhost:5000/api/cart/add", {
            productId: id,
            quantity: -1,
          });
          setCart(
            cart.map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
        }
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  // const decreaseQuantity = async (id) => {
  //   const item = cart.find((item) => item._id === id);
  //   if (!item) return;

  //   if (item.quantity === 1) {
  //     removeFromCart(id);
  //   } else {
  //     try {
  //       await axios.post("http://localhost:5000/api/cart/add", {
  //         productId: id,
  //         quantity: -1,
  //       });
  //       setCart(
  //         cart.map((item) =>
  //           item._id === id ? { ...item, quantity: item.quantity - 1 } : item
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Error decreasing quantity:", error);
  //     }
  //   }
  // };

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      localStorage.setItem(
        "pendingAction",
        JSON.stringify({
          type: "ADD_TO_WISHLIST",
          product,
        })
      );
      return <Navigate to="/login" />;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/wishlist/add",
        {
          productId: product._id,
        }
      );
      setWishlist(response.data);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ac8e8e]"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* {isAuthenticated && ( */}
      <Navbar
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* )} */}

      <Routes>
        <Route
          path="/"
          element={
            // <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProductList
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              cart={cart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              searchTerm={searchTerm}
            />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={
            // <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProductDetails
              addToCart={addToCart}
              cart={cart}
              updateCartQuantity={updateCartQuantity}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Cart
                cart={cart}
                setCart={setCart}
                addToWishlist={addToWishlist}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Wishlist
                wishlist={wishlist}
                setWishlist={setWishlist}
                addToCart={addToCart}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
      </Routes>
    </Router>
  );
}
