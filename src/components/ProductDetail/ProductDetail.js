import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product,setProduct] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/product/' + productKey)
        .then(response => response.json())
        .then(data => setProduct(data))
    },[productKey])
    console.log(product);
    return (
        <div>
            <h1 className='text-center py-3 bg-success'>Your Product Details here</h1>
            <Product showAddToCart={false} productAsPropsName={product}></Product>
        </div>
    );
};

export default ProductDetail;