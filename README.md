# 🌾 AgriMarket

**AgriMarket** is a web-based AgriTech platform that connects **farmers**, **buyers**, and **logistics providers** in one integrated system.  
It makes it easy for farmers to sell produce online, buyers to shop for farm goods, and admins to coordinate deliveries — all in a single, user-friendly interface.

---

## 🚜 Overview

AgriMarket was designed as a **Software Engineering final-year project** to demonstrate practical problem-solving in the agricultural supply chain through technology.  
It provides a working prototype of a farm-to-market digital ecosystem with product posting, purchasing, fleet management, and delivery tracking.

---

## 🚀 Features

### 👨‍🌾 Farmers
- Create an account and post products for sale.  
- Upload images or use URLs for listings.  
- Set product name, quantity, price, and location.  
- Posts remain pending until approved by the admin.  

### 🛒 Buyers
- Browse available products and add to cart.  
- Edit quantities, view totals, and manage checkout.  
- Checkout requires a saved shipping address (name, city, phone).  
- Payment options: M-Pesa, Airtel Money, or Card (demo only).  
- View order history and mark items as *Received* once delivered.  

### 🧑‍💼 Admin
- Login with secure credentials.  
- Approve or reject product listings from farmers.  
- Edit marketplace product details (name, image, price, quantity).  
- Add fleet and driver details for delivery assignments.  
- Track all orders and mark as dispatched or completed.  

### 💡 Additional Features
- Sliding cart drawer from the right (modern UI).  
- Quantity reduction after purchase.  
- Quantity restoration when items are removed from cart.  
- LocalStorage persistence (data saved in browser).  
- Fully responsive on mobile, tablet, and desktop.  
- Clean, professional Bootstrap 5 layout.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript (ES6) |
| Framework | Bootstrap 5 |
| Storage | Browser LocalStorage (demo) |
| Deployment | Works offline or on any static host (GitHub Pages, Netlify, etc.) |

---

## 📂 Folder Structure

AgriMarket/
│
├── index.html # Homepage showing products
├── login.html # Customer login page
├── signup.html # Customer signup page
├── account.html # Customer dashboard (profile, orders, post item)
├── admin.html # Admin dashboard for approvals and management
│
├── css/
│ └── style.css # Main stylesheet
│
├── js/
│ └── app.js # Main application logic (login, cart, listings)
│
└── README.md # Project documentation


---

## 🧑‍💻 Getting Started

### 1. Clone or Download
```bash
git clone https://github.com/yourusername/AgriMarket.git

2. Open the Project
cd AgriMarket

3. Run

Just open index.html in your browser — no server setup needed.

🔐 Admin Login
Username	Password
admin	admin123
🧠 Future Enhancements

Add backend integration (Firebase or Node.js).

Real-time M-Pesa payment API.

Automated email/SMS order notifications.

Google Maps integration for delivery tracking.

Analytics dashboard for admins.

📸 Demo Products
Product	Sample Image
Maize	🌽
Wheat	🌾
Tomatoes	🍅
Peas	🟢
Beans	🫘
Kamande	🟤
Potatoes	🥔
Yellow Beans	🟡
Rosecoco Beans	🔴
Peanuts	🥜
📜 License

This project is open-source under the MIT License.
You can modify and distribute it for educational or personal use.

👨‍💻 Author

Clement Kiptoo

💬 “Empowering farmers through digital transformation.”

❤️ Acknowledgment

Developed as part of the Software Engineering Final-Year Project
at the intersection of technology and sustainable agriculture.

“Bridging the gap between farmers and markets through smart digital tools.”

