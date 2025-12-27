# CallQualify AI - Backend API

Enterprise-grade backend for AI-powered call transcription and qualification.

## 🚀 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport
- **Real-time**: WebSockets (Socket.io)
- **File Upload**: Multer
- **Validation**: class-validator

## 📋 Database Schema

### Models:
- **User**: Authentication and user management
- **Call**: Call recordings and metadata
- **Transcript**: AI-generated transcriptions
- **TranscriptLine**: Individual transcript segments with speaker diarization
- **QualificationRule**: Configurable business rules for call qualification
- **QualificationResult**: Results of rule evaluations
- **RuleResult**: Individual rule pass/fail with evidence
- **BatchJob**: Batch processing jobs for multiple calls

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm

### 1. Install Dependencies
```bash
cd backend/callqualify-api
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A strong secret key
- `PORT`: API port (default: 3001)

### 3. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init

# (Optional) Seed initial data
npx prisma db seed
```

### 4. Start Development Server
```bash
pnpm run start:dev
```

API will be available at: `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Calls
- `POST /api/calls/upload` - Upload single call recording
- `GET /api/calls` - List all calls (paginated)
- `GET /api/calls/:id` - Get call details
- `DELETE /api/calls/:id` - Delete call
- `POST /api/calls/:id/evaluate` - Trigger qualification

### Transcripts
- `GET /api/transcripts/:callId` - Get transcript for call

### Qualification Rules
- `GET /api/rules` - List all rules
- `POST /api/rules` - Create new rule
- `PUT /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule

### Batch Processing
- `POST /api/batch/upload` - Upload CSV of calls
- `GET /api/batch/:id` - Get batch status
- `WS /api/ws/batch/:id` - WebSocket for real-time progress

## 🗄️ Database Management

### View Database
```bash
npx prisma studio
```
Opens GUI at `http://localhost:5555`

### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📦 Project Structure

```
callqualify-api/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   ├── calls/                 # Call management module
│   ├── transcription/         # Transcription service
│   ├── qualification/         # Rule evaluation engine
│   ├── batch/                 # Batch processing
│   ├── websockets/            # Real-time updates
│   ├── common/                # Shared utilities
│   ├── app.module.ts          # Main app module
│   └── main.ts                # Entry point
├── uploads/                   # Uploaded files
└── .env                       # Environment variables
```

## 🔐 Default Qualification Rules

The system comes pre-configured with these rules:

1. **Proper Greeting**: Checks if agent properly introduces themselves
2. **Mandatory Disclosure**: Verifies required legal disclaimers
3. **Product Mentioned**: Ensures specific product/service is discussed
4. **Call Duration**: Validates minimum call length
5. **Consent Given**: Confirms customer consent

## 🚢 Deployment

### Using Docker
```bash
docker-compose up -d
```

### Manual Deployment
1. Set `NODE_ENV=production` in `.env`
2. Run `pnpm run build`
3. Start with `pnpm run start:prod`

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2025-12-27T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": { /* additional context */ }
  },
  "timestamp": "2025-12-27T10:30:00Z"
}
```

## 🔄 Next Steps

### Priority 1 (Current Sprint):
- [ ] Implement Auth module with JWT
- [ ] Build Call upload endpoint
- [ ] Create mock transcription service
- [ ] Build basic rule evaluation engine
- [ ] Add error handling & validation

### Priority 2:
- [ ] Implement batch upload (CSV)
- [ ] Add WebSocket for real-time updates
- [ ] Create rule management CRUD
- [ ] Add file storage (S3 integration)
- [ ] Implement queue system (Bull/BullMQ)

### Priority 3:
- [ ] Analytics endpoints
- [ ] Export functionality (CSV, JSON)
- [ ] Webhook notifications
- [ ] Rate limiting
- [ ] Admin dashboard APIs

## 📝 Notes

- Mock transcription service is used for development (no API costs)
- To integrate real AI:
  - Add `OPENAI_API_KEY` to `.env`
  - Update `transcription.service.ts` to use OpenAI Whisper API
- Database uses UUID for all IDs
- All timestamps are stored in UTC

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`

## 📄 License

Proprietary - CallQualify AI

---

**Built with ❤️ using NestJS**
