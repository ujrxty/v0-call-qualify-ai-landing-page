# 🧪 Testing Guide - CallQualify API

## Quick Start (Test in 5 Minutes!)

### 1. Setup Database
```bash
cd backend/callqualify-api

# Install PostgreSQL if you don't have it
# Then create a database:
createdb callqualify_db

# OR use Docker:
docker run --name callqualify-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=callqualify_db \
  -p 5432:5432 \
  -d postgres:14
```

### 2. Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (default works for local PostgreSQL)
```

### 3. Run Database Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to see your database
npx prisma studio
```

### 4. Start the Server
```bash
pnpm run start:dev
```

You should see:
```
✅ Database connected successfully
🚀 CallQualify API running on: http://localhost:3001/api
```

---

## 🔥 Test the Auth API

### Method 1: Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@callqualify.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@callqualify.com",
      "name": "Test User",
      "role": "USER",
      "createdAt": "2025-12-27T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**2. Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@callqualify.com",
    "password": "password123"
  }'
```

**3. Get your profile (protected route):**
```bash
# Replace YOUR_TOKEN with the token from login/register response
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Method 2: Using Postman/Insomnia/Thunder Client

#### Setup:
1. Create a new collection "CallQualify API"
2. Set base URL: `http://localhost:3001/api`

#### Test Endpoints:

**1. POST `/auth/register`**
```json
{
  "email": "john@example.com",
  "password": "secure123",
  "name": "John Doe"
}
```

**2. POST `/auth/login`**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**3. GET `/auth/me`**
- Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

---

### Method 3: Using JavaScript/Fetch

```javascript
// Register
const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'New User'
  })
});
const { data } = await registerResponse.json();
console.log('Token:', data.token);

// Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const loginData = await loginResponse.json();

// Get Profile
const profileResponse = await fetch('http://localhost:3001/api/auth/me', {
  headers: { 'Authorization': `Bearer ${loginData.data.token}` }
});
const profile = await profileResponse.json();
console.log('Profile:', profile);
```

---

## ✅ Expected Test Results

### ✓ Successful Register:
- Status: `201 Created`
- Returns user object + JWT token
- User saved in database

### ✓ Successful Login:
- Status: `200 OK`
- Returns user object + JWT token
- Token is valid for 7 days

### ✓ Protected Route Access:
- Status: `200 OK` with valid token
- Status: `401 Unauthorized` without token

### ✗ Error Cases to Test:

**Duplicate email:**
```bash
# Register same email twice
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@callqualify.com", "password": "pass123"}'
```
Expected: `409 Conflict` - "Email already registered"

**Invalid credentials:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type": "application/json" \
  -d '{"email": "test@callqualify.com", "password": "wrongpass"}'
```
Expected: `401 Unauthorized` - "Invalid credentials"

**Missing fields:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
Expected: `400 Bad Request` - Validation errors

---

## 🔍 Debug Tips

**Check database:**
```bash
npx prisma studio
# Opens GUI at http://localhost:5555
```

**View logs:**
```bash
# Server logs show:
# - Database connection
# - Incoming requests
# - Errors
```

**Reset database:**
```bash
npx prisma migrate reset
# ⚠️ Deletes all data!
```

---

## 🎯 Next Features to Test

Coming soon:
- [ ] Call upload API
- [ ] Mock transcription
- [ ] Rule evaluation
- [ ] Batch processing
- [ ] WebSocket real-time updates

---

## 🐛 Common Issues

**"Database connection failed"**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Try: `createdb callqualify_db`

**"Port 3001 already in use"**
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3001 | xargs kill`

**"Module not found"**
- Run: `pnpm install`
- Run: `npx prisma generate`

---

**Ready to test? Start the server and try the auth endpoints! 🚀**
