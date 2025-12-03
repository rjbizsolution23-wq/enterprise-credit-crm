# 📮 Click2Mail Quick Start Guide

**RJ Business Solutions - Rick Jefferson**

---

## 🚀 Quick Setup

### 1. Configure Credentials

Add to `.env`:
```env
CLICK2MAIL_USERNAME="rj1006"
CLICK2MAIL_PASSWORD="Nadia1123$"
CLICK2MAIL_ENVIRONMENT="production"
```

### 2. Mail a Dispute Letter

```typescript
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

// Mail single dispute
const result = await disputeMailerService.mailDispute('dispute-id', {
  returnAddress: {
    name: 'RJ Business Solutions',
    address1: '1342 NM 333',
    city: 'Tijeras',
    state: 'NM',
    zip: '87059',
  },
})

console.log(`Mailed! Job: ${result.jobId}, Cost: $${result.cost}`)
```

### 3. Check Status

```typescript
const status = await disputeMailerService.checkMailingStatus('dispute-id')
console.log(`Status: ${status.status}, Tracking: ${status.tracking}`)
```

---

## 📡 API Usage

### Mail Dispute Letter
```bash
POST /api/disputes/:id/mail
{
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

### Mail Batch
```bash
POST /api/disputes/batch/mail
{
  "disputeIds": ["id1", "id2", "id3"],
  "returnAddress": {...}
}
```

---

## ✅ What Happens Automatically

1. Dispute letter generated (FCRA 609/611)
2. Converted to PDF
3. Uploaded to Click2Mail
4. Address list created
5. Mail job created
6. Job submitted
7. Status tracked
8. Database updated

---

**That's it! Your dispute letters are now automatically mailed! 🎉**

