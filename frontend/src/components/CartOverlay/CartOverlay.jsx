// src/components/CartOverlay/CartOverlay.jsx
import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "../../graphql/queries";
import { CART_TOTAL_LABEL, PLACE_ORDER_LABEL , MY_BAG } from "../../utils/constants";
import {kebabCase} from '../../utils/helpers';
import '../../styles/CartOverlay.css';

const CartOverlay = () => {
  const { cartItems, setCartItems, increaseQty, decreaseQty, setCartOpen } = useContext(CartContext);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const [createOrder] = useMutation(CREATE_ORDER);

  const handleClose = () => setCartOpen(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      const formattedItems = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        attributes: Object.entries(item.selectedAttributes).map(([key, value]) => ({ key, value }))
      }));

      const { data } = await createOrder({
        variables: {
          total_price: parseFloat(totalPrice),
          items: formattedItems
        }
      });

      if (data?.createOrder?.id) {
        alert("✅ Order placed successfully!");
        setCartItems([]);
        setCartOpen(false);
      } else {
        alert("⚠️ Failed to place order.");
      }
    } catch (err) {
      console.error("❌ Order failed", err);
      alert("❌ Order error.");
    }
  };

  return (
    <div
      className="cart-overlay-backdrop"
      data-testid="cart-overlay"
      onClick={handleClose}
    >
      <div className="cart-overlay-panel" onClick={e => e.stopPropagation()}>
        <div className="cartHead p-2 border-bottom d-flex  align-items-center">
          <p className="fs-5 fw-bold"> {MY_BAG}</p> &nbsp; 
          <p className="fs-6 fw-light"> {cartItems.length} {cartItems.length > 1 ? 'Items' : 'Item'}</p> 
        </div>

        <div className="p-3 cart-overlay-body">
          {cartItems.map((item, index) => (
            <div key={`${item.product_id}-${index}`} className="mb-4 border-bottom pb-3">
              <div className="row">
                <div className="col-8">
                  <h5>{item.name}</h5>
                  <p>${item.price.toFixed(2)}</p>
                  {item.attributes.map(attr => (
                    <div key={attr.name} data-testid={`cart-item-attribute-${kebabCase(attr.name)}`} className="mb-2">
                      <p className="fw-bold mb-1">{attr.name}:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {attr.items.map(opt => {
                          const isSelected = item.selectedAttributes[attr.name] === opt;
                          const baseTestId = `cart-item-attribute-${kebabCase(attr.name)}-${kebabCase(opt)}`;
                          const selectedTestId = isSelected ? `${baseTestId}-selected` : baseTestId;
                          const kebabItem = kebabCase(opt);
         
                          return (
                            <div
                              key={`border-${kebabCase(opt)}`}
                              className={`swatch-wrapper ${attr.type === 'swatch' && isSelected ? 'selected' : ''}`}
                            >
                              <div
                                data-testid={selectedTestId}
                                className={`border p-2
                                  ${isSelected && attr.type !== 'swatch' ? 'bg-dark text-white' : 'border'} 
                                  ${attr.type === 'swatch' ? `cart-swatch-color color-${kebabItem}` : ''} 
                                  ${isSelected ? 'selected' : ''}
                                `} 
                              >
                                {attr.type !== 'swatch' && opt}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-1 d-flex flex-column align-items-center justify-content-between">
                  <button onClick={() => increaseQty(index)} data-testid="cart-item-amount-increase" className="btn btn-outline-secondary btn-sm">+</button>
                  <span data-testid="cart-item-amount" className="fw-bold">{item.quantity}</span>
                  <button onClick={() => decreaseQty(index)} data-testid="cart-item-amount-decrease" className="btn btn-outline-secondary btn-sm">-</button>
                </div>

                <div className="col-3 d-flex justify-content-center align-items-center">
                  {item.gallery?.[0] && (
                    <img src={item.gallery[0]} alt={item.name} className="border rounded object-fit-contain  cartItemImage"  />
                  )}
                </div>
              </div>
            </div>
          ))}


          </div >
          <div className="cartBottom">
            <div className="text-end fw-bold" data-testid="cart-total">
              {CART_TOTAL_LABEL} ${totalPrice}
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="btn btn-success mt-3 w-100"
            >
              {PLACE_ORDER_LABEL}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
