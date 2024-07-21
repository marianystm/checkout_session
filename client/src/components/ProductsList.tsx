import axios from "axios";
import { useEffect, useState } from "react";
import { Price } from "../models/IPrices";
import { Product } from "../models/IProduct";

export const ProductsList = () => {
  const [products, setProducts] = useState<CombinedProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Hej");
    const fetchProducts = async () => {
      try {
        console.log("Hej");
        const response = await axios.get<{products: Product[], prices: Price[]}>("http://localhost:3000/products");
        const { products, prices } = response.data;

        const combinedProducts = products.map(product => {
          const priceDetail = prices.find(price => price.product === product.id);
          return {
            id: product.id,
            name: product.name,
            description: product.description || "No description available",
            price: priceDetail ? `${priceDetail.unit_amount / 100} ${priceDetail.currency.toUpperCase()}` : 'No price available'
          };
        });

        setProducts(combinedProducts);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
        setError("Failed to fetch products: " + error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.description} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
