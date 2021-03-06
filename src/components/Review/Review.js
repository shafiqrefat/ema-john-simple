import React, { useEffect } from 'react';
import { useState } from 'react';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager';
import ReviewItem from '../ReviewItem/ReviewItem';
import './Review.css'
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif'
import { useHistory } from 'react-router-dom';

const Review = () => {
    const [cart,setCart] = useState([]);
    const [orderPlaced,setOrderPlaced] = useState(false);
    const history = useHistory()

    const handleProceedCheckout = () => {
        history.push('/shipment');
    }

    const removeProduct = productKey => {
        const newCart = cart.filter(pd=>pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(() => {
        const savedCart =getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        fetch('https://fast-headland-22715.herokuapp.com/productsByKeys',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productKeys)
        })
        .then(response => response.json())
        .then(data => setCart(data))
    },[])
    let thankYou;
    if (orderPlaced){
        thankYou = <img src={happyImage} alt=""/>
    }
    return (
        <div className='main-container'>
            <div className='review-container'>
                {
                    cart.map(pd=> <ReviewItem 
                        key = {pd.key}
                        removeProduct = {removeProduct}
                        product={pd}></ReviewItem>)
                }
                {thankYou}
            </div>
            <div className='cart-container'>
                <Cart cart={cart}></Cart>
                <button onClick={handleProceedCheckout} className='main-button'>Proceed Checkout</button>
            </div>
        </div>
    );
};

export default Review;