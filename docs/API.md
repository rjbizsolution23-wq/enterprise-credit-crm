# 📡 Enterprise Credit Repair CRM - API Documentation

**RJ Business Solutions - Rick Jefferson**
**Build Date:** December 2, 2025

---

## 🌐 Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

---

## 🔐 Authentication

All protected endpoints require authentication via JWT token.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 📋 API Endpoints

### Authentication

#### POST `/api/auth/login`

Login user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "SPECIALIST"
  }
}
```

#### POST `/api/auth/register`

Register new user (Admin only).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "SPECIALIST"
}
```

---

### Clients

#### GET `/api/clients`

Get all clients with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `stage`: Filter by client stage
- `status`: Filter by client status
- `search`: Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "client_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "stage": "ACTIVE_ROUND_1",
      "status": "ACTIVE",
      "scoreTransUnionCurrent": 650,
      "scoreEquifaxCurrent": 645,
      "scoreExperianCurrent": 655
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET `/api/clients/:id`

Get single client by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "client_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "stage": "ACTIVE_ROUND_1",
    "status": "ACTIVE",
    "creditReports": [...],
    "disputes": [...],
    "tradelines": [...],
    "payments": [...]
  }
}
```

#### POST `/api/clients`

Create new client.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "stage": "NEW_LEAD",
  "servicePackage": "PREMIUM_129",
  "assignedSpecialistId": "specialist_id"
}
```

#### PUT `/api/clients/:id`

Update client.

**Request Body:**
```json
{
  "stage": "ACTIVE_ROUND_1",
  "scoreTransUnionCurrent": 650
}
```

#### DELETE `/api/clients/:id`

Delete client (soft delete).

---

### Disputes

#### GET `/api/disputes`

Get all disputes.

**Query Parameters:**
- `clientId`: Filter by client
- `status`: Filter by status
- `round`: Filter by dispute round
- `bureau`: Filter by credit bureau

#### POST `/api/disputes`

Create new dispute.

**Request Body:**
```json
{
  "clientId": "client_id",
  "round": "ROUND_1_FCRA_609_611",
  "type": "FCRA_609",
  "method": "MAIL",
  "bureau": "TRANSUNION",
  "items": [
    {
      "negativeItemId": "item_id",
      "description": "Collection account",
      "reason": "NOT_MINE"
    }
  ]
}
```

#### POST `/api/disputes/:id/generate-letter`

Generate dispute letter.

**Response:**
```json
{
  "success": true,
  "letter": "Full letter text...",
  "format": "FCRA_609"
}
```

#### POST `/api/disputes/:id/generate-metro2`

Generate Metro 2 dispute file.

**Response:**
```json
{
  "success": true,
  "file": "Metro 2 file content...",
  "format": "METRO_2"
}
```

---

### Tradelines

#### GET `/api/tradelines`

Get all tradelines.

**Query Parameters:**
- `clientId`: Filter by client
- `type`: Filter by tradeline type
- `status`: Filter by status

#### POST `/api/tradelines`

Create new tradeline.

**Request Body:**
```json
{
  "clientId": "client_id",
  "type": "AUTHORIZED_USER",
  "accountName": "Chase Credit Card",
  "accountNumber": "1234567890",
  "creditLimit": 5000,
  "currentBalance": 1200,
  "dateOpened": "2023-01-15"
}
```

---

### Payments

#### GET `/api/payments`

Get all payments.

**Query Parameters:**
- `clientId`: Filter by client
- `status`: Filter by payment status
- `dateFrom`: Start date
- `dateTo`: End date

#### POST `/api/payments`

Create payment record.

**Request Body:**
```json
{
  "clientId": "client_id",
  "amount": 129.00,
  "type": "MONTHLY_SUBSCRIPTION",
  "method": "CREDIT_CARD",
  "dueDate": "2025-12-15"
}
```

---

### Credit Reports

#### GET `/api/reports/:clientId`

Get credit reports for client.

#### POST `/api/reports`

Upload/import credit report.

**Request Body:**
```json
{
  "clientId": "client_id",
  "bureau": "TRANSUNION",
  "reportDate": "2025-12-01",
  "score": 650,
  "reportData": {...}
}
```

---

### Tasks

#### GET `/api/tasks`

Get all tasks.

**Query Parameters:**
- `assignedToId`: Filter by assigned user
- `clientId`: Filter by client
- `status`: Filter by status
- `priority`: Filter by priority

#### POST `/api/tasks`

Create new task.

**Request Body:**
```json
{
  "title": "Follow up with client",
  "description": "Call client about dispute response",
  "clientId": "client_id",
  "assignedToId": "user_id",
  "priority": "HIGH",
  "dueDate": "2025-12-10"
}
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {...}
  }
}
```

### Error Codes

- `AUTH_REQUIRED`: Authentication required
- `AUTH_INVALID`: Invalid credentials
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `SERVER_ERROR`: Internal server error

---

## 🔒 Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user

---

## 📝 Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- All monetary values are in USD (decimal format)
- Pagination is available on list endpoints
- Filtering and sorting available on most endpoints

---

**RJ Business Solutions**
**Rick Jefferson**
**December 2, 2025**
