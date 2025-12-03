# 📮 Click2Mail Integration - Automated Dispute Letter Mailing

**RJ Business Solutions - Rick Jefferson**  
**Date:** December 2, 2025

---

## 🎯 Overview

Complete Click2Mail integration for automated direct mail of dispute letters. This integration allows you to automatically print and mail dispute letters to credit bureaus and creditors without manual intervention.

**API Documentation:**
- [Get Account Addresses](https://developers.click2mail.com/reference/getaccountaddresses)
- [Getting Started](https://developers.click2mail.com/docs/getting-started)
- [Building Your First API Call](https://developers.click2mail.com/docs/building-your-first-api-call)
- [Python SDK](https://developers.click2mail.com/docs/python-sdk)

---

## ✅ Features Implemented

### Core Functionality
- ✅ Document upload (PDF dispute letters)
- ✅ Address list creation
- ✅ Mail job creation and submission
- ✅ Job status tracking
- ✅ USPS tracking integration
- ✅ Credit balance checking
- ✅ Cost estimation
- ✅ Batch mailing support

### Automated Workflows
- ✅ Single dispute letter mailing
- ✅ Batch dispute letter mailing
- ✅ Automatic status updates
- ✅ Tracking number retrieval
- ✅ Cost tracking

---

## 🔧 Configuration

### Environment Variables

```env
CLICK2MAIL_USERNAME="rj1006"
CLICK2MAIL_PASSWORD="Nadia1123$"
CLICK2MAIL_ENVIRONMENT="production"  # or "stage" for testing
```

### API Endpoints

**Production:**
- Base URL: `https://rest.click2mail.com/molpro`

**Staging (Testing):**
- Base URL: `https://stage-rest.click2mail.com/molpro`

---

## 📡 API Endpoints

### Mail Single Dispute Letter
```http
POST /api/disputes/:id/mail
```

**Request Body:**
```json
{
  "returnAddress": {
    "name": "RJ Business Solutions",
    "company": "RJ Business Solutions",
    "address1": "1342 NM 333",
    "city": "Tijeras",
    "state": "NM",
    "zip": "87059"
  },
  "mailClass": "First Class"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "12345",
    "cost": 0.55,
    "status": "submitted",
    "tracking": "9400111899223197428490"
  }
}
```

### Mail Batch Dispute Letters
```http
POST /api/disputes/batch/mail
```

**Request Body:**
```json
{
  "disputeIds": ["dispute-id-1", "dispute-id-2", "dispute-id-3"],
  "returnAddress": {
    "name": "RJ Business Solutions",
    "address1": "1342 NM 333",
    "city": "Tijeras",
    "state": "NM",
    "zip": "87059"
  },
  "mailClass": "First Class"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "12346",
    "cost": 1.65,
    "status": "submitted",
    "disputeCount": 3
  }
}
```

### Check Mailing Status
```http
GET /api/disputes/:id/mail
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "details": {...},
    "tracking": "9400111899223197428490"
  }
}
```

### Click2Mail Direct API
```http
POST /api/integrations/click2mail
```

**Actions:**
- `mailDisputeLetter` - Mail single letter
- `mailDisputeLettersBatch` - Mail batch
- `uploadDocument` - Upload PDF
- `createAddressList` - Create address list
- `createJob` - Create mail job
- `submitJob` - Submit job
- `getJobStatus` - Get status
- `getJobDetails` - Get details
- `getJobCost` - Get cost
- `getUSPSTracking` - Get tracking
- `getCreditBalance` - Check balance
- `purchaseCredit` - Add credit
- `getAccountAddresses` - Get addresses

---

## 🚀 Usage Examples

### Mail Single Dispute Letter

```typescript
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

const result = await disputeMailerService.mailDispute('dispute-id', {
  returnAddress: {
    name: 'RJ Business Solutions',
    address1: '1342 NM 333',
    city: 'Tijeras',
    state: 'NM',
    zip: '87059',
  },
  mailClass: 'First Class',
})

console.log(`Mailed! Job ID: ${result.jobId}, Cost: $${result.cost}`)
```

### Mail Batch Dispute Letters

```typescript
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

const result = await disputeMailerService.mailDisputesBatch(
  ['dispute-1', 'dispute-2', 'dispute-3'],
  {
    returnAddress: {
      name: 'RJ Business Solutions',
      address1: '1342 NM 333',
      city: 'Tijeras',
      state: 'NM',
      zip: '87059',
    },
  }
)

console.log(`Mailed ${result.disputeCount} letters! Cost: $${result.cost}`)
```

### Check Status

```typescript
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

const status = await disputeMailerService.checkMailingStatus('dispute-id')
console.log(`Status: ${status.status}, Tracking: ${status.tracking}`)
```

### Direct Click2Mail API

```typescript
import { click2mailClient } from '@/lib/integrations/click2mail'

// Check credit balance
const balance = await click2mailClient.getCreditBalance()
console.log(`Balance: $${balance.balance}`)

// Upload document
const documentId = await click2mailClient.uploadDocument({
  documentName: 'dispute_letter.pdf',
  documentContent: pdfBuffer,
  documentType: 'pdf',
})

// Create address list
const addressListId = await click2mailClient.createAddressList(
  'Dispute Recipients',
  [
    {
      name: 'TransUnion',
      address1: 'P.O. Box 2000',
      city: 'Chester',
      state: 'PA',
      zip: '19016-2000',
    },
  ]
)

// Create and submit job
const jobId = await click2mailClient.createJob({
  documentId,
  addressListId,
  mailClass: 'First Class',
})

await click2mailClient.submitJob(jobId)

// Get tracking
const tracking = await click2mailClient.getUSPSTracking(jobId)
```

---

## 📋 Complete Workflow

### 1. Create Dispute
```typescript
// Dispute is created in database
const dispute = await prisma.dispute.create({...})
```

### 2. Generate Dispute Letter
```typescript
// Letter is automatically generated using DisputeGenerator
const letter = DisputeGenerator.generateFCRA609(client, items, bureau)
```

### 3. Mail Dispute Letter
```typescript
// Automatically mail via Click2Mail
const result = await disputeMailerService.mailDispute(dispute.id, {
  returnAddress: companyAddress,
})
```

### 4. Track Mailing
```typescript
// Check status and get tracking
const status = await disputeMailerService.checkMailingStatus(dispute.id)
```

### 5. Update Dispute Record
```typescript
// Status automatically updated in database
// Tracking number stored
// Cost recorded
```

---

## 💰 Pricing

Click2Mail pricing varies by:
- Mail class (First Class, Standard, Priority)
- Document size
- Number of pages
- Color vs. black & white

**Typical Costs:**
- First Class Letter (1 page): ~$0.55
- Standard Mail: ~$0.35
- Priority Mail: ~$7.50+

---

## 🔐 Security

- Credentials stored in environment variables
- Never commit passwords to git
- Use staging environment for testing
- Monitor credit balance
- Track all mailings

---

## 📊 Integration with Dispute System

The Click2Mail integration automatically:

1. ✅ Generates dispute letter (FCRA 609/611)
2. ✅ Converts to PDF
3. ✅ Uploads to Click2Mail
4. ✅ Creates address list
5. ✅ Creates mail job
6. ✅ Submits for printing/mailing
7. ✅ Tracks status
8. ✅ Updates dispute record
9. ✅ Stores tracking number
10. ✅ Records cost

---

## 🎯 Benefits

- ✅ **Automation** - No manual printing/mailing
- ✅ **Compliance** - Proper mailing addresses
- ✅ **Tracking** - USPS tracking for all mailings
- ✅ **Cost Tracking** - Automatic cost recording
- ✅ **Batch Processing** - Mail multiple at once
- ✅ **Status Updates** - Real-time status tracking
- ✅ **Professional** - Printed and mailed professionally

---

## 📚 References

- [Click2Mail API Reference](https://developers.click2mail.com/reference/getaccountaddresses)
- [Getting Started Guide](https://developers.click2mail.com/docs/getting-started)
- [Building API Calls](https://developers.click2mail.com/docs/building-your-first-api-call)
- [Python SDK](https://developers.click2mail.com/docs/python-sdk)

---

**RJ Business Solutions**  
**Rick Jefferson**  
**December 2, 2025**

