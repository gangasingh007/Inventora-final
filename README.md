# MERN E-Commerce Site Backend

This is the backend API for a MERN stack e-commerce site. It provides RESTful endpoints for user authentication, admin management, cart operations, coupon management, order processing, and analytics.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Admin](#admin)
  - [Cart](#cart)
  - [Coupon](#coupon)
  - [Order](#order)
  - [Analytics](#analytics)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Setup](#setup)

---

## Features
- User registration and login (JWT-based authentication)
- Admin user management
- Cart management (add, update, remove items)
- Coupon creation and application
- Order creation and management
- Sales and analytics endpoints
- Middleware for authentication and error handling

---

## API Endpoints

### Auth
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | /api/auth/register | Register a new user        |
| POST   | /api/auth/login    | Login and get JWT token    |
| GET    | /api/auth/me       | Get current user profile   |

### Admin
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | /api/admin/users   | Get all users (admin only) |
| PATCH  | /api/admin/user/:id | Update user (admin only)   |
| DELETE | /api/admin/user/:id | Delete user (admin only)   |

### Cart
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | /api/cart/         | Get current user's cart    |
| POST   | /api/cart/add      | Add item to cart           |
| PATCH  | /api/cart/update   | Update cart item quantity  |
| DELETE | /api/cart/remove/:itemId | Remove item from cart |

### Coupon
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | /api/coupon/create | Create a new coupon (admin) |
| GET    | /api/coupon/       | Get all coupons            |
| POST   | /api/coupon/apply  | Apply coupon to cart       |

### Order
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | /api/order/create  | Create a new order         |
| GET    | /api/order/        | Get user's orders          |
| GET    | /api/order/:id     | Get order by ID            |
| PATCH  | /api/order/:id/status | Update order status (admin) |

### Analytics
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| GET    | /api/analytics/sales | Get sales analytics (admin) |
| GET    | /api/analytics/users | Get user analytics (admin)  |

---

## Error Handling
All errors are returned in JSON format with an `error` message. Authentication is required for most endpoints. Admin routes require admin privileges.

---

## Project Structure
```
backend/
  index.js
  config/
    db.js
  controllers/
    admin.controller.js
    analytics.controller.js
    auth.controller.js
    cart.controller.js
    coupon.controller.js
    order.controller.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
  models/
    cart.model.js
    coupon.model.js
    order.model.js
    user.model.js
  routes/
    admin.routes.js
    analytics.routes.js
    auth.routes.js
    cart.routes.js
    coupon.routes.js
    order.routes.js
  utils/
    asyncHandler.js
```

---

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (e.g., MongoDB URI, JWT secret).
4. Start the backend server:
   ```bash
   npm start
   ```

---

## License
MIT
