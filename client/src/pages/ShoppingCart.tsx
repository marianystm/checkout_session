export const ShoppingCart = () => {
    return<>
    <h3>Shopping Cart</h3>
    <form action="/create-checkout-session" method="POST">
        <button type="submit" id="checkout-button">Checkout</button>
      </form>
    </>
}