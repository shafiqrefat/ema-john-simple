import React from 'react';

const Product = (props) => {
    return (
        <div>
            <h1>This is Product</h1>
            <h3>{props.productAsPropsName.name}</h3>
        </div>
    );
};

export default Product;