# FoodHub 🍱

## Discover & Order Delicious Meals

FoodHub is a full-stack meal ordering platform where customers can explore meals, place orders, and track deliveries. Food providers can manage their menus and orders, while admins can manage users, providers, and platform activities.

---

## 🚀 Live Demo

[foodhub-domain.vercel.app](https://foodhub-domain.vercel.app)

---

## 📌 Project Overview

FoodHub provides a complete food ordering ecosystem with three types of users:

- **Customers** can browse meals, add items to cart, place orders, track orders, and review meals.
- **Providers** can create menus, manage food items, and process customer orders.
- **Admins** can monitor users, manage categories, and control the platform.

---

# ✨ Features

## 🌍 Public Features

- Browse all available meals
- Search and filter meals
- Filter by:
  - Cuisine
  - Dietary preference
  - Price range
- View provider profiles
- View restaurant menus

---

## 👤 Customer Features

- Register/Login as customer
- Browse meals
- Add meals to cart
- Place orders
- Cash on Delivery support
- Track order status
- View order history
- Review purchased meals
- Manage profile

---

## 🍳 Provider Features

- Register/Login as provider
- Create restaurant profile
- Add new meals
- Update meals
- Delete meals
- Manage menu
- View customer orders
- Update order status

Order status flow:

```
PLACED
   ↓
PREPARING
   ↓
READY
   ↓
DELIVERED
```

---

## 🛡️ Admin Features

- Admin dashboard
- View all users
- Manage customers/providers
- Suspend or activate users
- View all orders
- Manage food categories

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Next.js / React Router
- TypeScript
- Tailwind CSS
- DaisyUI / ShadCN UI
- TanStack Query
- Axios
- React Hook Form

## Backend

- Node.js
- Express.js
- REST API

## Database

- MongoDB

## Authentication

- JWT Authentication
- Role Based Authorization

---

# 📂 Project Structure

```
FoodHub/

├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
│
└── README.md
```

---

# 🔐 User Roles

| Role | Permission |
|---|---|
| Customer | Order meals, track delivery, review |
| Provider | Manage meals and orders |
| Admin | Manage entire platform |

---

# 📄 Pages & Routes

## Public Routes

| Route | Description |
|-|-|
| `/` | Homepage |
| `/meals` | Browse meals |
| `/meals/:id` | Meal details |
| `/providers/:id` | Provider profile |
| `/login` | Login |
| `/register` | Registration |

---

## Customer Routes

| Route | Description |
|-|-|
| `/cart` | Cart items |
| `/checkout` | Checkout |
| `/orders` | My orders |
| `/orders/:id` | Order details |
| `/profile` | User profile |

---

## Provider Routes

| Route | Description |
|-|-|
| `/provider/dashboard` | Provider dashboard |
| `/provider/menu` | Manage meals |
| `/provider/orders` | Manage orders |

---

## Admin Routes

| Route | Description |
|-|-|
| `/admin` | Dashboard |
| `/admin/users` | User management |
| `/admin/orders` | Orders |
| `/admin/categories` | Categories |

---

# 🔌 API Documentation

## Authentication

### Register User

```
POST /api/auth/register
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "customer"
}
```

---

### Login

```
POST /api/auth/login
```

---

### Current User

```
GET /api/auth/me
```

---

# Meals API

Get all meals:

```
GET /api/meals
```

Get meal details:

```
GET /api/meals/:id
```

---

# Provider API

Create meal:

```
POST /api/provider/meals
```

Update meal:

```
PUT /api/provider/meals/:id
```

Delete meal:

```
DELETE /api/provider/meals/:id
```

Update order status:

```
PATCH /api/provider/orders/:id
```

---

# Order API

Create order:

```
POST /api/orders
```

Get orders:

```
GET /api/orders
```

Order details:

```
GET /api/orders/:id
```

---

# Admin API

Get users:

```
GET /api/admin/users
```

Update user status:

```
PATCH /api/admin/users/:id
```

---

# 🗄️ Database Collections

## Users

Example:

```json
{
  "_id": "123",
  "name": "John",
  "email": "john@gmail.com",
  "role": "customer",
  "status": "active"
}
```

---

## ProviderProfiles

```json
{
  "userId": "123",
  "restaurantName": "Food House",
  "address": "Dhaka",
  "description": "Best meals"
}
```

---

## Categories

```json
{
  "name": "Fast Food",
  "image": "url"
}
```

---

## Meals

```json
{
  "title": "Burger",
  "price": 10,
  "category": "Fast Food",
  "providerId": "123"
}
```

---

## Orders

```json
{
  "customerId": "123",
  "items": [],
  "address": "Dhaka",
  "status": "PLACED"
}
```

---

## Reviews

```json
{
  "customerId": "123",
  "mealId": "456",
  "rating": 5,
  "comment": "Great food"
}
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone your-repository-url
```

---

## Install Client

```bash
cd client

npm install
```

Run:

```bash
npm run dev
```

---

## Install Server

```bash
cd server

npm install
```

Run:

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create `.env` file:

## Backend

```
PORT=5000

DATABASE_URL=your_mongodb_url

JWT_SECRET=your_secret

```

## Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# 🔮 Future Improvements

- Online payment integration
- Real-time order tracking
- Delivery partner system
- Push notifications
- Food recommendation system
- AI based meal suggestions

---

# 👨‍💻 Author

Md Shafayat Hossain

GitHub:
> github.com/shafayatGit

Portfolio:
> [https://shafayat-dev.vercel.app/](https://shafayat-dev.vercel.app/)

---

## ⭐ If you like this project, give it a star!