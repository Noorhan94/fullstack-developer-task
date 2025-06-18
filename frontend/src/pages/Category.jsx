import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../graphql/queries";
import ProductList from "../components/ProductList";
import {
  LOADING_PRODUCTS_TEXT,
  ERROR_LOADING_PRODUCTS,
  NO_PRODUCTS_FOUND_TEXT,
  DEFAULT_CATEGORY_LABEL,
  CATEGORY_ALL_KEY,
} from "../utils/constants";

const Category = () => {
  const { categoryName } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>{LOADING_PRODUCTS_TEXT}</p>;
  if (error) return <p>{ERROR_LOADING_PRODUCTS} {error.message}</p>;

  const normalizedCategory = categoryName?.toLowerCase() || CATEGORY_ALL_KEY;

  const filteredProducts =
    normalizedCategory === "all"
      ? data.products
      : data.products.filter(
          (product) =>
            product.category?.toLowerCase() === normalizedCategory
        );

    if (filteredProducts.length === 0) {
      return (
        <div className="container my-5">
          <h2>{NO_PRODUCTS_FOUND_TEXT}</h2>
        </div>
      );
    }
  return (
    <div className="container my-5">
  
      <h2 className="mb-4 text-capitalize category-title">
        {categoryName ? categoryName : DEFAULT_CATEGORY_LABEL}
      </h2>      
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default Category;
