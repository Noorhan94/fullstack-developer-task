import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onQuickShop }) => {
  return (
    <div className="container">
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-sm-6 col-md-4" key={product.id}>
            <ProductCard product={product} onQuickShop={onQuickShop} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
