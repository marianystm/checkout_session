import axios from "axios";
import { useEffect, useState } from "react";
import { Price } from "../models/IPrices";
import { Product } from "../models/IProduct";
import CheckoutButton from "./CheckoutButton";

interface CombinedProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId: string;
}

export const ProductsList = () => {
  const [products, setProducts] = useState<CombinedProductData[]>([]);
  const [cart, setCart] = useState<CombinedProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{
          products: Product[];
          prices: Price[];
        }>("http://localhost:3000/products");
        const { products, prices } = response.data;

        const combinedProducts = products.map((product) => {
          const priceDetail = prices.find(
            (price) => price.product === product.id
          );
          return {
            id: product.id,
            name: product.name,
            description: product.description || "Ingen beskrivning tillgänglig",
            price: priceDetail
              ? `${
                  priceDetail.unit_amount / 100
                } ${priceDetail.currency.toUpperCase()}`
              : "Inget pris tillgängligt",
            priceId: priceDetail ? priceDetail.id : "", // Hämta Stripe pris-ID
          };
        });

        setProducts(combinedProducts);
        setLoading(false);
      } catch (error: any) {
        console.error("Fel vid hämtning av produkter:", error.message);
        setError("Misslyckades att hämta produkter: " + error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: CombinedProductData) => {
    setCart([...cart, product]); 
    console.log("Nuvarande kundvagn:", cart);
  };

  if (loading) return <p>Laddar produkter...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Produkter</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.description} - {product.price}
            <button onClick={() => addToCart(product)}>
              Lägg till i kundvagn
            </button>
          </li>
        ))}
      </ul>
      <div>
        <h2>Kundvagn</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
        <CheckoutButton cart={cart} />
      </div>
    </div>
  );
};

export default ProductsList;
