// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from "./context/CategoryContext";

import App from './App';
import './index.css';

const client = new ApolloClient({
  uri: 'https://lightcyan-goldfinch-559528.hostingersite.com/public/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <BrowserRouter>
          <CategoryProvider>
            <App />
          </CategoryProvider>
        </BrowserRouter>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);
