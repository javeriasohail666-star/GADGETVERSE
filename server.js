const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// --- MONGODB CONNECTION SETTINGS ---
const db_user = 'laaly145_db_user'; 
const db_pass = 'Gadget123'; // <--- Sirf yahan apna password likhein
const cluster = 'cluster0.odr0ndv.mongodb.net';
const db_name = 'gadgetverse';

// Password ko encode karna zaroori hai agar usme @, #, $, % wagera hon
const safePassword = encodeURIComponent(db_pass);

// Puri link ab aise banegi
const mongoURI = `mongodb+srv://${db_user}:${safePassword}@${cluster}/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ GadgetVerse Cloud Database Connected!"))
    .catch(err => {
        console.log("❌ Connection Failed!");
        console.error("Galti: ", err.message);
    });
// ------------------------------------

// Simple Order Model
const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    items: Array,
    total: String,
    date: { type: Date, default: Date.now }
}));

// API Routes
// server.js ka ye hissa update karein
app.post('/api/order', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        console.log("✅ Order Saved in MongoDB!"); // Ye terminal mein dikhega
        res.json({ success: true });
    } catch (err) {
        console.log("❌ MongoDB Save Error:", err.message); // <--- Ye line asli galti batayegi
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/orders', async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));