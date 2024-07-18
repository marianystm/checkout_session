import axios from 'axios';
import { useEffect, useState } from 'react';
import { Product } from '../models/IProduct';


export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products');
                setProducts(response.data.products);
                
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - {product.description} - {product.price}
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
