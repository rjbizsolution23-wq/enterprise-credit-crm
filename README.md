# 🏢 Enterprise Credit Repair CRM

![RJ Business Solutions](https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg)

**Built by RJ Business Solutions**

📍 1342 NM 333, Tijeras, New Mexico 87059

🌐 [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)

**Build Date:** December 2, 2025

---

## 🚀 Overview

Complete Enterprise Credit Repair CRM system with full automation, legal compliance, and comprehensive client management. Built for credit repair businesses to manage clients, automate disputes, track tradelines, and ensure FCRA and Metro 2 compliance.

## ✨ Features

### Core CRM Functionality
- ✅ Complete client management with 11-stage pipeline tracking
- ✅ Three-bureau credit score tracking (TransUnion, Equifax, Experian)
- ✅ Automated dispute generation (FCRA 609/611, Metro 2, CFPB)
- ✅ Tradeline management (Authorized User, Business, Primary)
- ✅ Payment processing and billing
- ✅ Task management and activity tracking
- ✅ Document management
- ✅ Multi-channel communication tracking

### Legal Compliance
- ✅ **Metro 2 Compliance** - Full Metro 2 format generation
- ✅ **FCRA Compliance** - Automated FCRA 609/611 dispute letters
- ✅ **CFPB Integration** - Automated complaint generation
- ✅ **Attorney General Complaints** - State-level dispute automation
- ✅ Legal document templates and compliance tracking

### Advanced Features
- ✅ AI-powered engagement scoring
- ✅ Churn risk prediction
- ✅ Automated workflow triggers
- ✅ Real-time notifications
- ✅ Comprehensive reporting and analytics
- ✅ Role-based access control (Admin, Manager, Specialist, Viewer)
- ✅ Multi-user collaboration

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2.0 (App Router)
- **Language:** TypeScript 5.5.0
- **UI Library:** React 18.3.0
- **Styling:** Tailwind CSS 3.4.0
- **Components:** shadcn/ui
- **State Management:** Zustand 4.5.0, TanStack Query 5.56.0
- **Forms:** React Hook Form 7.52.0 + Zod 3.23.0
- **Charts:** Recharts 2.12.0

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma 5.19.0
- **Authentication:** JWT-based sessions

### Infrastructure
- **Deployment:** Vercel (recommended)
- **CI/CD:** GitHub Actions
- **Version Control:** Git
- **Package Manager:** npm

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/rjbizsolution23-wq/enterprise-credit-crm.git

# Navigate to project directory
cd enterprise-credit-crm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL="postgresql://user:password@localhost:5432/credit_crm"
# NEXTAUTH_SECRET="your-secret-key"
# NEXTAUTH_URL="http://localhost:3000"

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/credit_crm"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Database Setup

1. Create PostgreSQL database
2. Update `DATABASE_URL` in `.env`
3. Run migrations: `npm run db:migrate`
4. (Optional) Open Prisma Studio: `npm run db:studio`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Self-Hosted

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

Full documentation available in `/docs` directory:

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design
- [API Reference](./docs/API.md) - Complete API documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment instructions
- [Citations](./docs/CITATIONS.md) - All sources and references
- [Contributing](./docs/CONTRIBUTING.md) - Contribution guidelines

## 🗄️ Database Schema

Complete database schema with 18 core entities:

- **Users** - Authentication and authorization
- **Clients** - Complete client profiles
- **Credit Reports** - Three-bureau reports
- **Disputes** - All dispute types
- **Tradelines** - All tradeline types
- **Payments** - Billing and payments
- **Tasks** - Task management
- **Activities** - Activity logging
- **Documents** - File management
- **Communications** - Multi-channel tracking

See `prisma/schema.prisma` for complete schema.

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Password hashing (bcryptjs)
- Input validation (Zod)
- SQL injection protection (Prisma)
- Environment variable protection

See [SECURITY.md](./SECURITY.md) for security policies.

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 📧 Contact

**Rick Jefferson**
**RJ Business Solutions**

- 📧 Email: rjbizsolution23@gmail.com
- 🌐 Website: [rickjeffersonsolutions.com](https://rickjeffersonsolutions.com)
- 💼 LinkedIn: [in/rick-jefferson-314998235](https://linkedin.com/in/rick-jefferson-314998235)
- 🐙 GitHub: [@rickjeffsolutions](https://github.com/rickjeffsolutions)
- 📍 Address: 1342 NM 333, Tijeras, New Mexico 87059

---

**© 2025 RJ Business Solutions. All rights reserved.**

**Built with ❤️ by RJ Business Solutions**
