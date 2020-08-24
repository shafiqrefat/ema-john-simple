import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import './Product.css'

const Product = (props) => {
    const { img, name, seller, price, stock } = props.productAsPropsName;
    return (
        <div className="product">
            <div>
                <img src={img} alt="" />
            </div>
            <div>
                <h3 className="product-name">{name}</h3>

                <div className="product-detail">
                    <p><small>by: {seller}</small></p>
                    <p>${price}</p>
                    <p><small>only {stock} left in stock - order soon</small></p>
                    <button 
                    className="main-button"
                    onClick={()=>props.handleAddProduct(props.productAsPropsName)}>
                        <FontAwesomeIcon icon={faShoppingCart} />add to cart</button>
                </div>

            </div>

        </div>
    );
};

export default Product;