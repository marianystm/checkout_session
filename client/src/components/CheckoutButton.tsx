import axios from "axios";

interface CheckoutButtonProps {
  cart: CombinedProductData[];
}

export const CheckoutButton = ({ cart }: CheckoutButtonProps) => {
  const handleCheckout = async () => {
    try {
        const cartItems = cart.map((item) => ({
            priceId: item.priceId,  
            quantity: 1
        }));

      const response = await axios.post(
        "http://localhost:3000/create-checkout-session",
        { cartItems }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Failed to create a checkout session:", error);
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default CheckoutButton;
