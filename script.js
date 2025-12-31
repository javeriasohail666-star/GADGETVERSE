// 1. ELITE PRODUCTS DATA
const products = [
    { id: 1, name: "Neural Pro Headphones", price: 8499, cat: "audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
    { id: 2, name: "Nebula S-Watch", price: 12999, cat: "wearable", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" },
    { id: 3, name: "Mech Zero Keyboard", price: 5200, cat: "gaming", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600" },
    { id: 4, name: "G-Sync Pro Mouse", price: 2100, cat: "gaming", img: "https://images.unsplash.com/photo-1527698266440-12104e498b76?w=600" },
    { id: 5, name: "X-Controller Elite", price: 4500, cat: "gaming", img: "https://images.unsplash.com/photo-1600080972464-8e5f35802117?w=600" },
    { id: 6, name: "Studio Podcast Mic", price: 6800, cat: "audio", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600" },
    { id: 7, name: "Razer Blade 15", price: 98000, cat: "gaming", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600" },
    { id: 8, name: "AirPods Elite Max", price: 45000, cat: "audio", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=600" },
    { id: 9, name: "DJI Mavic Air 3", price: 62000, cat: "gaming", img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600" },
    { id: 10, name: "Ultra-Wide Monitor", price: 42000, cat: "gaming", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600" }
];

let cart = [];

// 2. NAVIGATION LOGIC
function showSection(section) {
    ['hero-section', 'shop-section', 'about-section', 'contact-section'].forEach(s => {
        document.getElementById(s).style.display = 'none';
    });
    document.getElementById(`${section}-section`).style.display = 'block';
    if(section === 'shop') renderProducts('all');
    window.scrollTo(0, 0);
}

// 3. RENDER PRODUCTS
function renderProducts(category) {
    const grid = document.getElementById('product-grid');
    const filtered = category === 'all' ? products : products.filter(p => p.cat === category);
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${category}`)?.classList.add('active');

    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}">
            <p style="color:var(--primary); font-size:0.7rem; font-weight:800; letter-spacing:1px;">${p.cat.toUpperCase()}</p>
            <h3>${p.name}</h3>
            <p style="color:var(--accent); font-size:1.4rem; font-weight:800; margin:10px 0;">₹${p.price.toLocaleString()}</p>
            <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// 4. CART LOGIC
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }
function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
    if(!document.getElementById('cart-sidebar').classList.contains('active')) toggleCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-items').innerHTML = cart.map((item, i) => `
        <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px; background:var(--glass); padding:10px; border-radius:12px; border:1px solid var(--border);">
            <img src="${item.img}" width="40" height="40" style="border-radius:5px; object-fit:cover;">
            <div style="flex:1"><h5>${item.name}</h5><p style="font-size:0.8rem">₹${item.price.toLocaleString()}</p></div>
            <i class="fas fa-trash" style="color:#ef4444; cursor:pointer" onclick="removeItem(${i})"></i>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cart-total').innerText = "₹" + total.toLocaleString();
    document.getElementById('check-total').innerText = "₹" + total.toLocaleString();
}

function removeItem(i) { cart.splice(i, 1); updateCart(); }

function openCheckout() {
    if(cart.length === 0) return alert("Your bag is empty!");
    toggleCart();
    toggleModal('checkout-modal');
}

// 5. FORM SUBMISSIONS (THE CRITICAL PART)

// Order Submit logic with MongoDB integration
document.getElementById('orderForm').onsubmit = async (e) => {
    e.preventDefault();
    
    // Nayi IDs se data uthana
    const orderData = {
        customerName: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        address: document.getElementById('custAddress').value,
        items: cart,
        total: document.getElementById('check-total').innerText
    };

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();
        
        if(result.success) {
            alert("🚀 Order Confirmed! Elite items are being prepared.");
            cart = []; 
            updateCart(); 
            toggleModal('checkout-modal');
        } else {
            alert("Order failed to save. Check server.");
        }
    } catch (err) {
        alert("Server Offline! Please check your terminal.");
    }
};

// Login simulation
document.getElementById('loginForm').onsubmit = (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('l-email').value;
    const userName = userEmail.split('@')[0].toUpperCase();
    document.getElementById('login-nav').innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    toggleModal('login-modal');
    alert(`Welcome to GadgetVerse, ${userName}!`);
};

window.onload = () => showSection('hero');