import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
  query getProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      gallery
      price
      in_stock
      attributes {
        name
        type
        items
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      in_stock
      gallery
      category
      attributes {
        name
        type
        items
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($total_price: Float!, $items: [OrderItemInput!]!) {
    createOrder(total_price: $total_price, items: $items) {
      id
      total_price
      items {
        product_id
        quantity
        price
        attributes {
          key
          value
        }
      }
    }
  }
`;
