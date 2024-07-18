import axios from 'axios';

export const CheckoutButton = () => {
    const handleCheckout = async () => {
        try {
            
            const response = await axios.post('http://localhost:3000/create-checkout-session');
            
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Failed to create a checkout session:', error);
        }
    };

    return (
        <button onClick={handleCheckout}>
            Checkout
        </button>
    );
};

export default CheckoutButton;
