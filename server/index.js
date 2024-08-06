const stripe = require('stripe')('sk_test_51P4SxmJFlaokILLiJdhU19rSojwuwKXoivG7TtdA2qmHDRXcKKgGvI0dua8RgEST6hNkBBuwFL9P21kLJ3dRfGQ200KD3FZGvT');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(cookieSession({
    name: 'session',
    keys: ['secret1', 'secret2'],
    maxAge: 24 * 60 * 60 * 1000 
}));

app.use(express.json());
app.use(express.static('public'));

const YOUR_DOMAIN = `http://localhost:${PORT}`;

const users = {};

const userFilePath = path.join(__dirname, 'users.json'); 
const orderFilePath = path.join(__dirname, 'orders.json');

function saveUser(data) {
  fs.readFile(userFilePath, (err, content) => {
    if (err) {
      fs.writeFile(userFilePath, JSON.stringify([data]), { flag: 'wx' }, (err) => {
        if (err) console.error('Error writing new user file:', err);
      });
    } else {
      const users = JSON.parse(content);
      users.push(data);
      fs.writeFile(userFilePath, JSON.stringify(users), (err) => {
        if (err) console.error('Error updating user file:', err);
      });
    }
  });
}

function saveOrder(data) {
  fs.readFile(orderFilePath, (err, content) => {
    if (err) {
      fs.writeFile(orderFilePath, JSON.stringify([data]), { flag: 'wx' }, (err) => {
        if (err) console.error('Error writing new order file:', err);
      });
    } else {
      const orders = JSON.parse(content);
      orders.push(data);
      fs.writeFile(orderFilePath, JSON.stringify(orders), (err) => {
        if (err) console.error('Error updating order file:', err);
      });
    }
  });
}

app.post('/create-checkout-session', async (req, res) => {
    if (!req.session.username || !req.session.customerId) {
        return res.status(401).json({ message: "Inte inloggad eller ingen kund-ID tillgänglig." });
    }

    const cartItems = req.body.cartItems;
    const pickupLocation = req.body.pickupLocation; // Lägg till pickupLocation i begäran

    try {
        const line_items = cartItems.map(item => ({
            price: item.priceId,
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            customer: req.session.customerId,  
            line_items,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
            metadata: {
                username: req.session.username,
                pickupLocation: pickupLocation // Lägg till pickupLocation i metadata
            }
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    fs.readFile(userFilePath, async (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Serverfel vid inläsning av användardata." });
        }
        const users = JSON.parse(data.toString());
        const user = users.find(u => u.email === email);
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            req.session.username = email;
            req.session.customerId = user.customerId;
            res.json({ message: "Du är inloggad!" });
        } else {
            res.status(401).json({ message: "Fel e-postadress eller lösenord!" });
        }
    });
});

app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const customer = await stripe.customers.create({ email, name });

        const newUser = {
            email,
            name,
            hashedPassword,
            customerId: customer.id
        };

        users[email] = newUser; 
      
        saveUser(newUser); 
  
        req.session.username = email; 
        req.session.customerId = customer.id;
        res.status(200).json({ message: "Användare registrerad", customerId: customer.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/success', async (req, res) => {
    const sessionId = req.query.session_id; 

    if (!sessionId) {
        return res.status(400).send("Session ID är saknat.");
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const customer = await stripe.customers.retrieve(session.customer);
        const products = await stripe.checkout.sessions.listLineItems(sessionId);

        const orderData = {
            orderNumber: sessionId,
            date: new Date().toISOString(),
            customer: {
                email: customer.email,
                name: customer.name
            },
            products: products.data.map(product => ({
                description: product.description,
                quantity: product.quantity,
                amount: product.amount_total
            })),
            totalAmount: session.amount_total,
            currency: session.currency,
            pickupLocation: session.metadata.pickupLocation,
            status: 'completed'
        };

        saveOrder(orderData);

        res.status(200).send("Köp genomfört! Tack för ditt köp.");
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        res.status(500).send("Kunde inte hämta sessioninformation.");
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await stripe.products.list({
            limit: 4 
        });
        const prices = await stripe.prices.list({
            limit: 4 
        });
       
        res.json({ products: products.data, prices: prices.data });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: error.message });
    }
});

app.get('/cancel', (req, res) => {
    res.status(200).send("Köp avbrutet. Du har inte debiterats.");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
