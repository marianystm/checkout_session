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
            res.json({ message: "Du är inloggad!" });
        } else {
            res.status(401).json({ message: "Fel e-postadress eller lösenord!" });
        }
    });
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

const userFilePath = path.join(__dirname, 'users.json'); // Ange sökvägen där du vill spara filen

function saveUser(data) {
  fs.readFile(userFilePath, (err, content) => {
    if (err) {
      // Om filen inte finns, skapa den
      fs.writeFile(userFilePath, JSON.stringify([data]), { flag: 'wx' }, (err) => {
        if (err) console.error('Error writing new user file:', err);
      });
    } else {
      // Om filen finns, läs den och lägg till den nya användaren
      const users = JSON.parse(content);
      users.push(data);
      fs.writeFile(userFilePath, JSON.stringify(users), (err) => {
        if (err) console.error('Error updating user file:', err);
      });
    }
  });
}



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
  
      users[email] = newUser; // Lägg till i den interna cache-liknande strukturen om du fortfarande vill använda den
  
      saveUser(newUser); // Spara till fil
  
      req.session.username = email; 
      res.status(200).json({ message: "Användare registrerad", customerId: customer.id });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message });
    }
  });
  

app.get('/success', (req, res) => {

    res.status(200).send("Köp genomfört! Tack för ditt köp.");
   
});

app.get('/cancel', (req, res) => {
    res.status(200).send("Köp avbrutet. Du har inte debiterats.");
    
});





app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
