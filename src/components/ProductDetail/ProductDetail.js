import React from 'react';
import { useParams } from 'react-router-dom';
import fakeData from '../../fakeData';
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const product = fakeData.find(pdct => pdct.key === productKey);
    console.log(product);
    return (
        <div>
            <h1 className='text-center py-3 bg-success'>Your Product Details here</h1>
            <Product showAddToCart={false} productAsPropsName={product}></Product>
        </div>
    );
};

export default ProductDetail;