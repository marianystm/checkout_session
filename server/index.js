const stripe = require('stripe')('sk_test_51P4SxmJFlaokILLiJdhU19rSojwuwKXoivG7TtdA2qmHDRXcKKgGvI0dua8RgEST6hNkBBuwFL9P21kLJ3dRfGQ200KD3FZGvT');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.static('public'));

const YOUR_DOMAIN = `http://localhost:${PORT}`;


app.post('/create-checkout-session', async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "Inte inloggad" });
    }

    const cartItems = req.body.cartItems;

    try {
        const line_items = cartItems.map(item => ({
            price: item.priceId,
            quantity: item.quantity
        }));

        const customer = users[req.session.username].customerId;

        const session = await stripe.checkout.sessions.create({
            customer: customer,  
            line_items,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});



app.use(cookieSession({
    name: 'session',
    keys: ['secret1', 'secret2'],
    maxAge: 24 * 60 * 60 * 1000 
}));

app.post('/', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        req.session.username = username;
        res.status(200).send({ message: "Du är inloggad!" });
    } else {
        res.status(401).send({ message: "Fel användarnamn eller lösenord!" });
    }
});

app.get('/products', async (req, res) => {
    console.log("hej");
    try {
        const products = await stripe.products.list({
            limit: 4 // Du kan anpassa detta värde efter behov
        });
        const prices = await stripe.prices.list({
            limit: 4 // Matcha antalet produkter
        });
       
        res.json({ products: products.data, prices: prices.data });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: error.message });
    }
});

const users = {};


app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await stripe.customers.create({ email, name });

        users[email] = {
            email,
            name,
            hashedPassword,
            customerId: customer.id  
        };

        req.session.username = email; 

        res.status(200).json({ message: "Användare registrerad", customerId: customer.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
