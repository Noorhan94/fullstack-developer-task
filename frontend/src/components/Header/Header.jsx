// src/components/Header/Header.jsx
import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { CATEGORIES } from "../../utils/constants";
import storeLogo from "../../assets/icons/StoreLogo.png";
import emptyBlackCartIcon from "../../assets/icons/EmptyBlackCart.png";
import { CategoryContext } from "../../context/CategoryContext";
import "../../styles/Header.css";

const Header = () => {
  const { cartItems, isCartOpen, setCartOpen } = useContext(CartContext);
  const location = useLocation();

  const handleCartClick = () => {
    setCartOpen(!isCartOpen);
  };
const { activeCategory, setActiveCategory } = useContext(CategoryContext);

  return (
    <header className="sticky-top bg-white">
      <nav className="headerDiv container d-flex justify-content-between align-items-center ">
        
        {/* Left - Category Links */}
        <div className="d-flex gap-4 pt-3">
          {CATEGORIES.map((category) => (
            <NavLink
              key={category}
              to={`/${category}`}
              onClick={() => setActiveCategory(category)}
              className={`category-link ${activeCategory === category ? "active-category" : ""}`}
              data-testid={activeCategory === category ? "active-category-link" : "category-link"}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </NavLink>
          ))}
        </div>

        {/* Center - Brand */}
        <div className="text-center">
          <NavLink to="/" className="navbar-brand fw-bold fs-4">
            <img
              src={storeLogo}
              alt="storeLogo"
              className="storeLogo"
            />
          </NavLink>
        </div>

        {/* Right - Cart Icon */}
        <div className="position-relative">
          <button
            className="headerCartBtn"
            onClick={handleCartClick}
            data-testid="cart-btn"
          >
            <img src={emptyBlackCartIcon} alt="Cart" />
            {cartItems.length > 0 && (
              <span className="badge bg-dark rounded-pill position-absolute top-3 start-100 translate-middle">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Header;
