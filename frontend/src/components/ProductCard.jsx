import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { kebabCase } from "../utils/helpers";
import { OUT_OF_STOCK_TEXT } from "../utils/constants";
import emptyWhiteCartIcon from '../assets/icons/EmptyWhiteCart.png'; 

import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setCartOpen } = useContext(CartContext);
  const [isHovered, setHovered] = useState(false);

  const handleQuickShop = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const defaultAttributes = {};
    product.attributes.forEach(attr => {
      defaultAttributes[attr.name] = attr.items[0];
    });

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      attributes: product.attributes,
      selectedAttributes: defaultAttributes,
      quantity: 1,
    });

    setCartOpen(true);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const lowerCaseProductName = product.name.toString().toLowerCase();

  return (
    <div
      data-testid={`product-${kebabCase(lowerCaseProductName)}`}
      className="product-card p-2 position-relative  rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      role="button"
    >
      <div className="position-relative productImageContainer">
        {!product.in_stock && (
          <span className="position-absolute top-50 start-50 translate-middle text-uppercase outOfStockText">
            {OUT_OF_STOCK_TEXT}
          </span>
        )}
        <img
          src={product.gallery?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={product.name}
          className={`img-fluid w-100 h-100 object-fit-contain ${!product.in_stock ? "opacity-50" : ""}`}
        />
      </div>

      <div className="mt-2">
        <h5 className="mb-1 productName">{product.name}</h5>
        <p className="text-muted mb-0">${product.price.toFixed(2)}</p>
      </div>

      {product.in_stock && isHovered && (
        <button
          data-testid="quick-shop-button"
          type="button"
          onClick={handleQuickShop}
          className="quick-shop-btn position-absolute text-white border-0 rounded-circle d-flex align-items-center justify-content-center fs-5 cursor-pointer"
        >

        <img src={emptyWhiteCartIcon} alt="Cart"  />

        </button>
      )}
    </div>
  );
};

export default ProductCard;
