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

---

## 📞 Test the Calls API (NEW!)

### Upload a Call Recording

**Using cURL:**
```bash
# First, login to get your token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@test.com","password":"pass123"}' | jq -r '.data.token')

# Upload an audio file
curl -X POST http://localhost:3001/api/calls/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/your/audio.mp3" \
  -F "callerName=John Doe" \
  -F "callerPhone=555-1234" \
  -F "agentName=Sarah Smith" \
  -F "campaign=Lead Gen Q4"
```

**Using Postman:**
1. Set method to `POST`
2. URL: `http://localhost:3001/api/calls/upload`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body → form-data:
   - Key: `file` (type: File) → Select audio file
   - Key: `callerName` (type: Text) → "John Doe"
   - Key: `agentName` (type: Text) → "Sarah"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "recordingUrl": "/uploads/call-1234567890.mp3",
    "fileName": "my-call.mp3",
    "fileSize": 1048576,
    "fileFormat": "audio/mpeg",
    "status": "PENDING",
    "metadata": {
      "caller_name": "John Doe",
      "caller_phone": "555-1234",
      "agent_name": "Sarah Smith",
      "campaign": "Lead Gen Q4"
    },
    "createdAt": "2025-12-27T..."
  },
  "message": "Call uploaded successfully. Processing will begin shortly."
}
```

### List All Calls

```bash
# Get all calls (paginated)
curl http://localhost:3001/api/calls \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl "http://localhost:3001/api/calls?status=COMPLETED&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Search calls
curl "http://localhost:3001/api/calls?search=John" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Call Details

```bash
# Replace CALL_ID with actual ID from upload response
curl http://localhost:3001/api/calls/CALL_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Get Call Stats

```bash
curl http://localhost:3001/api/calls/stats \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "pending": 3,
    "transcribing": 2,
    "evaluating": 1,
    "completed": 8,
    "failed": 1
  }
}
```

### Delete a Call

```bash
curl -X DELETE http://localhost:3001/api/calls/CALL_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎵 Test Audio Files

Don't have audio files? Generate test files:

**Using macOS:**
```bash
say "Hello, this is a test call recording" -o test-call.m4a
```

**Using Text-to-Speech online:**
- Visit: https://ttsmp3.com/
- Type some text
- Download as MP3

**Sample test text:**
```
Agent: Hello, this is Sarah from CallQualify AI. How can I help you today?
Customer: Hi, I'm interested in your lead qualification service.
Agent: Great! Let me explain how our AI transcription works...
```

---

## 🧪 Complete Test Flow

```bash
# 1. Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"demo123","name":"Demo User"}'

# 2. Save token from response, then upload call
curl -X POST http://localhost:3001/api/calls/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-call.mp3" \
  -F "callerName=Test Caller"

# 3. List calls
curl http://localhost:3001/api/calls \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Get stats
curl http://localhost:3001/api/calls/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🤖 Test Mock Transcription (AUTO!)

The transcription happens **automatically** when you upload a call! Here's what to expect:

### How It Works:
1. Upload a call → Status: `PENDING`
2. Wait 1-2 seconds → Status: `TRANSCRIBING`
3. Wait another 1-2 seconds → Status: `COMPLETED`

### Watch It Happen:

**Step 1: Upload a call**
```bash
curl -X POST http://localhost:3001/api/calls/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-call.mp3" \
  -F "callerName=John Doe"
```

**Step 2: Get the call ID from response and watch status updates**
```bash
# Replace CALL_ID with your actual call ID
CALL_ID="your-call-id-here"

# Check status immediately (should be PENDING or TRANSCRIBING)
curl http://localhost:3001/api/calls/$CALL_ID \
  -H "Authorization: Bearer $TOKEN"

# Wait 3 seconds, then check again (should be COMPLETED)
sleep 3
curl http://localhost:3001/api/calls/$CALL_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Step 3: View the full transcript**
```bash
curl http://localhost:3001/api/calls/$CALL_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response with transcript:**
```json
{
  "success": true,
  "data": {
    "id": "call-id",
    "status": "COMPLETED",
    "duration": 45230,
    "transcript": {
      "id": "transcript-id",
      "confidenceAvg": 0.94,
      "language": "en-US",
      "speakersCount": 2,
      "lines": [
        {
          "sequenceNumber": 1,
          "speaker": "AGENT",
          "text": "Good morning, this is Sarah from CallQualify AI. Am I speaking with John?",
          "startTime": 500,
          "endTime": 4200,
          "confidence": 0.96
        },
        {
          "sequenceNumber": 2,
          "speaker": "CUSTOMER",
          "text": "Yes, this is John speaking.",
          "startTime": 5800,
          "endTime": 7500,
          "confidence": 0.92
        }
        // ... more lines
      ]
    }
  }
}
```

### What Gets Generated:
- **Realistic call conversations** (3 different templates: lead qualification, demo, support)
- **Speaker diarization** (AGENT vs CUSTOMER)
- **Accurate timing** (based on text length, ~150 words/min)
- **Confidence scores** (0.80 - 0.99 range)
- **Call duration** (calculated from transcript)

### Check Stats After Upload:
```bash
curl http://localhost:3001/api/calls/stats \
  -H "Authorization: Bearer $TOKEN"
```

You'll see counts update:
```json
{
  "success": true,
  "data": {
    "total": 3,
    "pending": 0,
    "transcribing": 0,
    "completed": 3,
    "failed": 0
  }
}
```

---

**Ready to test? Start the server and try uploading calls! 🚀**
