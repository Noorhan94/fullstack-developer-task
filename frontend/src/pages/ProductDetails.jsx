import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { CartContext } from '../context/CartContext';
import {kebabCase} from '../utils/helpers';
import parse from 'html-react-parser';

import { GET_PRODUCT } from '../graphql/queries';
import {
  ATTR_NOT_SELECTED_MSG,
  ADD_TO_CART_TEXT,
  OUT_OF_STOCK_TEXT,
  PRICE
} from '../utils/constants';

import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });
  const { addToCart, setCartOpen } = useContext(CartContext);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product: {error.message}</p>;

  const product = data.product;

  const handleAttributeChange = (name, value) => {
    setSelectedAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (Object.keys(selectedAttributes).length !== product.attributes.length) {
      alert(ATTR_NOT_SELECTED_MSG);
      return;
    }

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      gallery: product.gallery,
      attributes: product.attributes,
      selectedAttributes,
      quantity: 1,
      in_stock: product.in_stock,
    });

    setCartOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.gallery.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
  };

  return (
    <div className="container my-4">
      <div className="row">
        {/* Gallery */}
        <div className="col-md-6 d-flex">
          <div className="thumbnail-list d-flex flex-column me-3" data-testid="product-gallery">
            {product.gallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                className={`thumbnail ${selectedImageIndex === idx ? 'selected' : ''}`}
                onClick={() => setSelectedImageIndex(idx)}
              />
            ))}
          </div>

          <div className="position-relative w-100">
            <img
              src={product.gallery[selectedImageIndex]}
              alt="Selected"
              className="main-image w-100 object-fit-contain"
            />
            <button className="carousel-arrow left" onClick={prevImage}>‹</button>
            <button className="carousel-arrow right" onClick={nextImage}>›</button>
          </div>
        </div>

        {/* Info */}
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>

          {product.attributes.map(attr => (
            <div key={attr.name} className="mb-4" data-testid={`product-attribute-${kebabCase(attr.name)}`}>
              <p className="fw-bold text-uppercase">{attr.name}:</p>
              <div className="d-flex gap-2 flex-wrap">
              {attr.items.map((item) => {
                const isSelected = selectedAttributes[attr.name] === item;
                const kebabName = kebabCase(attr.name);
                const kebabItem = kebabCase(item);

                return (
                  <div
                    key={`border-${item}`}
                    className={`${
                      attr.type === 'swatch' ? 'swatch-wrapper' : ''
                    } ${isSelected && attr.type === 'swatch' ? 'selected' : ''}`}
                    data-testid={`product-attribute-${kebabName}-${item}`}
                  >
                    <button
                      key={item}
                      className={
                        attr.type === 'swatch'
                          ? `swatch-color color-${kebabItem}`
                          : `attribute-btn ${isSelected ? 'selected' : ''}`
                      }
                      onClick={() => handleAttributeChange(attr.name, item)}
                    >
                      {attr.type !== 'swatch' && item}
                    </button>
                  </div>
                );
              })}

              </div>
            </div>
          ))}
          <p className="fw-bold text-uppercase">{PRICE}:</p>
          <p className="h5 mb-4 fw-bold">${product.price.toFixed(2)}</p>

          <button
            className="btn btn-success w-100"
            data-testid="add-to-cart"
            onClick={handleAddToCart}
            disabled={!product.in_stock || Object.keys(selectedAttributes).length !== product.attributes.length}
          >
            {product.in_stock ? ADD_TO_CART_TEXT : OUT_OF_STOCK_TEXT}
          </button>

          <div className="mt-4" data-testid="product-description">
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
