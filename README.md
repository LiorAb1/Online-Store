# L&T – Online Cosmetics Store

A full-stack online cosmetics store built with React, Node.js, Express, and MongoDB.

The website allows customers to browse skincare products, add items to their cart, choose a shipping method, and place orders. Product information is retrieved from MongoDB, and completed orders are saved through the backend API.

## Features

### Product Catalog
- Display products retrieved from MongoDB.
- Reusable React components for product cards.
- Loading and error handling when fetching products.

### Shopping Cart
- Add and remove products.
- Update product quantities.
- Automatically calculate cart totals.
- Save cart items in localStorage so they remain after refreshing the page.
- Animated add-to-cart interaction.

### Checkout
- Order summary with products, quantities, and prices.
- Customer details form with input validation.
- Pickup or home delivery options.
- Free-shipping coupon support.
- Automatic calculation of shipping costs and order totals.
- Order submission to the backend.
- Order confirmation displaying the generated order ID.

## Tech Stack

| Frontend | Backend | Database |
|---|---|---|
| React | Node.js | MongoDB |
| JavaScript | Express.js | Mongoose |
| HTML & CSS | REST API | |
| React Router | | |
| Axios | | |

## Project Structure

```text
Online-Store/
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Cart.js
│   │   ├── Navbar.js
│   │   ├── ProductCard.js
│   │   ├── OrderPage.js
│   │   └── OrderSuccessModal.js
│   └── package.json
├── Server/
│   ├── models/
│   ├── routes/
│   │   ├── products.js
│   │   └── orders.js
│   ├── server.js
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | Retrieve products from the database |
| POST | `/orders` | Validate and save a new order |
| GET | `/` | Check the server response |

Orders are stored in MongoDB, and successful requests return an order ID.

## Running the Project Locally

### Requirements
- Node.js and npm
- MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/LiorAb1/Online-Store.git
cd Online-Store
```

### 2. Start the backend

```bash
cd Server
npm install
```

Create a `.env` file inside the `Server` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then start the server:

```bash
node server.js
```

### 3. Start the frontend

Open another terminal:

```bash
cd Client
npm install
npm start
```

The frontend is configured to communicate with the backend at `http://localhost:5000`.

## How It Works

The React frontend requests products from the Express server, which retrieves them from MongoDB using Mongoose.

Customers can add products to their cart and adjust quantities. The cart is saved in localStorage.

During checkout, the customer enters their details, selects a shipping method, and submits the order. The backend validates required information and stores the order in MongoDB.

After a successful order, the application displays a confirmation with the order ID and clears the shopping cart.

## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Product Catalog
![Product Catalog](screenshots/products.png)

### Shopping Cart
![Shopping Cart](screenshots/cart.png)

### Order Summary
![Order Summary](screenshots/ordersummary.png)

### Checkout
![Checkout](screenshots/checkout.png)

### Order Confirmation
![Order Confirmation](screenshots/ordersuccess.png)

## Possible Improvements

- User authentication and order history.
- Admin dashboard for product and order management.
- Server-side validation of product prices and shipping discounts.
- Inventory management.
- Online payment integration.
- Deployment to a cloud hosting service.
