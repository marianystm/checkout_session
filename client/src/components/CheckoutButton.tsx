import axios from "axios";

interface CheckoutButtonProps {
  cart: CombinedProductData[];
  pickupLocation: string;
}

export const CheckoutButton = ({ cart, pickupLocation }: CheckoutButtonProps) => {
  const handleCheckout = async () => {
    try {
        const cartItems = cart.map((item) => ({
            priceId: item.priceId,  
            quantity: 1
        }));

      const response = await axios.post(
        "http://localhost:3000/create-checkout-session",
        { cartItems, pickupLocation }, { withCredentials: true }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Failed to create a checkout session:", error);
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
};

export default CheckoutButton;
