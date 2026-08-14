# ActiveHands Backend (Django + PostgreSQL + Supabase)

ActiveHands backend is a robust REST API service powered by **Django REST Framework (DRF)** and **PostgreSQL (Supabase)**.

## Features
- **User Authentication & Profiles**: Secure login, registration, token-based session management, maker points, tiers, and avatar storage.
- **Cart Management**: Real-time user cart stored directly in the database with guest-to-account synchronization upon sign-in.
- **Wishlist & Likes**: Persistent likes synchronized across devices for authenticated makers.
- **Orders & Checkout**: Order tracking, itemized receipt generation, shipping address recording, and maker points rewards.
- **Product Catalog**: Centralized DIY kits catalog with categories, ratings, and pricing.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

Your database credentials are configured in `backend/.env`:

```env
DB_HOST=aws-0-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.cyikhhrsmnmvppmptyrp
DB_PASSWORD=Aeiou@123456hello
DATABASE_URL=postgresql://postgres.cyikhhrsmnmvppmptyrp:Aeiou%40123456hello@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

---

## 🚀 Running the Backend

### 1. Apply Migrations to Supabase
```bash
python backend/manage.py migrate
```

### 2. Seed Initial Catalog and Demo User
```bash
python backend/manage.py seed_data
```

Demo User:
- **Email**: `artlover@activehands.com`
- **Password**: `password123`

### 3. Start Django Server (Port 8000)
```bash
python backend/manage.py runserver 8000
```
Or with npm shortcut from workspace root:
```bash
npm run backend
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive Auth Token
- `POST /api/auth/logout/` - Invalidate session
- `GET /api/auth/me/` - Retrieve current user profile, points, addresses, and orders

### Cart
- `GET /api/cart/` - Get user cart items
- `POST /api/cart/add/` - Add kit to cart
- `PUT /api/cart/update/<product_id>/` - Update item quantity
- `DELETE /api/cart/remove/<product_id>/` - Delete item from cart
- `POST /api/cart/clear/` - Empty user cart
- `POST /api/cart/sync/` - Merge guest cart into user database cart

### Wishlist
- `GET /api/wishlist/` - List user's liked kits
- `POST /api/wishlist/toggle/` - Toggle product in wishlist

### Orders
- `GET /api/orders/` - Retrieve past order history
- `POST /api/orders/create/` - Create a new order, award Maker Points (+50), and save address

### Products Catalog
- `GET /api/products/` - Retrieve DIY kits catalog (supports `?category=popular`, etc.)

---

## 🧪 Running Tests
```bash
python backend/manage.py test api
```
