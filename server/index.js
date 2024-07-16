const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors()); 
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
