import React from 'react';

const Cart = (props) => {
    const cart = props.cart;
    // const total = cart.reduce( (total,products) => total +products.price , 0 )
    let total = 0;
    for(let i = 0; i<cart.length; i++){
        const product = cart[i];
        total = total + product.price;
    }
    return (
        <div>
            <h4>Order Summery</h4>
            <p>Items Ordered: {cart.length}</p>
            <p>Total price {total}</p>
        </div>
    );
};

export default Cart;