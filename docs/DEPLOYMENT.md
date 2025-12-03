# 🚀 Enterprise Credit Repair CRM - Deployment Guide

**RJ Business Solutions - Rick Jefferson**
**Build Date:** December 2, 2025

---

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git installed
- GitHub account
- (Optional) Vercel account for hosting

---

## 🛠️ Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/rjbizsolution23-wq/enterprise-credit-crm.git
cd enterprise-credit-crm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/credit_crm"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository

Ensure all code is committed and pushed to GitHub.

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure environment variables

#### Step 3: Environment Variables

Add these in Vercel dashboard:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

#### Step 4: Deploy

Vercel will automatically deploy on push to main branch.

---

### Option 2: Self-Hosted (VPS/Dedicated Server)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

#### Step 2: Clone and Setup

```bash
git clone https://github.com/rjbizsolution23-wq/enterprise-credit-crm.git
cd enterprise-credit-crm
npm install
```

#### Step 3: Build Application

```bash
npm run build
```

#### Step 4: Configure Environment

```bash
cp .env.example .env
# Edit .env with production values
```

#### Step 5: Database Migration

```bash
npm run db:migrate
```

#### Step 6: Start with PM2

```bash
pm2 start npm --name "credit-crm" -- start
pm2 save
pm2 startup
```

#### Step 7: Setup Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Option 3: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/credit_crm
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=credit_crm
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Step 3: Deploy

```bash
docker-compose up -d
```

---

## 🗄️ Database Setup

### PostgreSQL Configuration

#### Create Database

```sql
CREATE DATABASE credit_crm;
CREATE USER credit_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE credit_crm TO credit_user;
```

#### Run Migrations

```bash
npm run db:migrate
```

### Database Backups

#### Automated Backup Script

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U credit_user credit_crm > backup_$DATE.sql
```

#### Restore Backup

```bash
psql -U credit_user credit_crm < backup_20251202_120000.sql
```

---

## 🔐 Security Checklist

- [ ] Change default database passwords
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Set up rate limiting
- [ ] Enable DDoS protection

---

## 📊 Monitoring

### Application Monitoring

- **Vercel Analytics**: Built-in analytics
- **Sentry**: Error tracking
- **LogRocket**: Session replay

### Database Monitoring

- **pgAdmin**: PostgreSQL administration
- **PostgreSQL logs**: Server logs
- **Query performance**: Slow query logs

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Automated workflows for:
- Testing on pull requests
- Building on merge
- Deploying to production
- Security scanning

See `.github/workflows/` for configuration.

---

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Error

```bash
# Check database is running
sudo systemctl status postgresql

# Test connection
psql -U credit_user -d credit_crm
```

#### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## 📞 Support

For deployment issues:
- **Email**: rjbizsolution23@gmail.com
- **Documentation**: See `/docs` folder
- **GitHub Issues**: Create issue on repository

---

**RJ Business Solutions**
**Rick Jefferson**
**December 2, 2025**
