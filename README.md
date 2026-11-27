# AP Enerfy Solar - Solar ERP & Billing Management System

A production-ready Enterprise Resource Planning (ERP) and GST Billing Management System engineered specifically for rooftop and ground-mounted solar installation enterprises.

![AP Enerfy Solar ERP Dashboard](images/image.png)

## Technology Stack

- **Framework**: Next.js 15 (App Router with Server & Client Components)
- **Language**: TypeScript with strict mode
- **Database**: Neon PostgreSQL (with embedded PostgreSQL PGlite fallback for local/offline dev)
- **ORM**: Drizzle ORM with schema migrations (`drizzle-kit`)
- **Styling**: Tailwind CSS & custom design tokens
- **Icons**: Lucide React
- **Authentication**: Auth.js / NextAuth
- **Data Tables**: TanStack Table
- **Charts & Analytics**: Recharts
- **Document Generation**: React PDF (`@react-pdf/renderer`) for GST Tax Invoices
- **Spreadsheet Processing**: ExcelJS for dynamic multi-column XLSX reports

---

## Design System & Reference Fidelity

The UI is built according to the design reference screenshots in `/images`:

1. **Dashboard (`/dashboard` - `images/image.png`)**:
   - Total Billed, Payments Received, Pending Amount, Active Projects pastel KPI cards
   - Recent Invoices table with live status badges
   - Monthly Revenue Trend chart with smooth curved area gradient
   - Quick action launchers (Invoice, Quotation, Customer, Project)
   - Active projects distribution (Installation vs Service vs Completed)
2. **Customers (`/customers` - `images/image1.png`)**:
   - Total Customers (248), New Customers (24), Installed Capacity (186 kW), Active Projects (32)
   - Filter bar with search, customer type, project status, and city location
   - Data table with customer type icons, capacity, outstanding balance, and actions
3. **Quotations & Plans (`/quotations` - `images/image copy.png`)**:
   - Total Quotations (186), Sent (132), Accepted (98), Pending (34), Lost (12)
   - System type classification (`On-Grid`, `Hybrid`, `Off-Grid`)
   - Pre-configured Solar Package plans (3 kW, 5 kW, 10 kW, 15 kW, 25 kW) with PM Surya Ghar subsidy estimates
4. **Invoices & Billing (`/invoices` - `images/image copy 2.png`)**:
   - Financial year-based document numbering (`INV-2025-XXXX`)
   - Sub-tabs for Tax Invoices, Proforma Invoices, Delivery Challans, and Receipts
   - Itemized GST calculations (CGST, SGST, IGST)
   - One-click PDF generation and direct print streaming
5. **Projects / Installations (`/projects` - `images/image copy 3.png`)**:
   - Progress bar tracking from rooftop survey to grid synchronization
   - Interactive Kanban view, Timeline Gantt, and GIS site map
6. **Products & Inventory (`/products` - `images/image copy 4.png`)**:
   - Solar panels (Waaree), Inverters (Growatt), Batteries (Livguard), Structures, Cables (Polycab), Protection ACDB/DCDB (Havells), MC4 connectors
   - Stock In / Stock Out adjustments with movement history audit
7. **Payments & Collections (`/payments` - `images/image copy 5.png`)**:
   - Advance, installment, and full receipt logging (`RCPT-2025-XXXX`)
   - Auto-updating invoice balance and customer outstanding ledger
8. **Reports & Analytics (`/reports` - `images/image copy 6.png`)**:
   - Revenue Overview bar chart (Revenue vs Expenses)
   - Sales by Product donut chart
   - Solar Energy Impact tracker (186 kW installed, ~1,32,000 kg CO2 avoided)
   - Top customers leaderboard and real-time activity stream

---

## Directory Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── customers/
│   │   ├── invoices/
│   │   │   └── [id]/pdf/       # Dynamic GST Tax Invoice PDF generation
│   │   ├── payments/
│   │   ├── products/
│   │   │   └── adjust/         # Stock In / Stock Out adjustment endpoint
│   │   ├── projects/
│   │   ├── quotations/
│   │   └── export/[type]/      # Dynamic Excel XLSX export endpoint
│   ├── dashboard/
│   ├── customers/
│   ├── quotations/
│   ├── invoices/
│   ├── projects/
│   ├── products/
│   ├── payments/
│   ├── reports/
│   ├── leads/
│   ├── purchases/
│   ├── expenses/
│   ├── subsidy/
│   ├── services/
│   ├── employees/
│   ├── settings/
│   └── login/
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Global search, branch switcher, notification center
│   │   ├── sidebar.tsx         # Collapsible dark navy-green sidebar (all 15 modules)
│   │   └── shell.tsx
│   ├── shared/
│   │   ├── kpi-card.tsx        # High-contrast pastel KPI cards
│   │   ├── status-badge.tsx    # Standardized color-coded status badges
│   │   └── modals/             # Reusable CRUD and transaction dialogs
│   └── ui/                     # Accessible shadcn-style component primitives
├── db/
│   ├── index.ts                # Neon PostgreSQL + PGlite fallback singleton
│   ├── migrate.ts              # SQL migration executor
│   ├── seed.ts                 # Demonstration data matching reference screenshots
│   ├── migrations/             # Generated SQL schema migrations
│   └── schema/                 # 20 Drizzle relational tables
├── lib/
│   ├── auth.ts                 # NextAuth credentials handler
│   ├── constants.ts            # Enums, statuses, brands, locations
│   ├── excel-export.ts         # ExcelJS report generator
│   └── utils.ts                # Indian currency and date formatting helpers
└── services/                   # Server-side business logic and database queries
```

---

## Getting Started

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# Remote Neon PostgreSQL (Optional - falls back to local embedded Postgres engine if omitted)
DATABASE_URL="postgresql://neondb_owner:password@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Auth Secret
AUTH_SECRET="ap-enerfy-solar-production-super-secret-key-32chars"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="AP Enerfy Solar"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Database Migrations & Seed Data

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Authentication & Test Credentials

| User Account | Identifier (Email or Username) | Password | Expected Role / Status |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@apenerfy.com` or `admin` | `password123` | Root Administrator (Redirects to `/dashboard`) |
| **Accountant** | `accountant@apenerfy.com` or `accountant` | `password123` | Billing & Accounts (Redirects to `/invoices`) |
| **Sales Executive** | `sales@apenerfy.com` or `sales` | `password123` | Commercial Sales (Redirects to `/quotations`) |
| **Storekeeper** | `store@apenerfy.com` or `store` | `password123` | Stock & Warehouse (Redirects to `/products`) |
| **Installation Engineer** | `engineer@apenerfy.com` or `engineer` | `password123` | Site Engineering (Redirects to `/projects`) |
| **Service Technician** | `tech@apenerfy.com` or `tech` | `password123` | Maintenance & AMC (Redirects to `/services`) |
| **Branch Manager** | `manager@apenerfy.com` or `manager` | `password123` | Branch Director (Redirects to `/dashboard`) |
| **Deactivated Account** | `deactivated@apenerfy.com` or `deactivated` | `password123` | HTTP 403 Forbidden (Blocked) |
| **Rate-Locked Account** | `locked@apenerfy.com` or `locked` | `password123` | HTTP 429 Too Many Requests (15m Lockout) |
| **First-Login Account** | `firstlogin@apenerfy.com` or `firstlogin` | `password123` | First-time password update modal |

---

## RBAC & Security Highlights

- **Split-Screen Login**: High-fidelity visual showcase on the left with live enterprise metrics, crisp right form with toggle password visibility, remember me, forgot password modal with expiring tokens, and a **1-click Role Switcher** accordion.
- **Granular Permissions**: 62 permissions across `customers`, `leads`, `invoices`, `quotations`, `projects`, `products`, `payments`, `purchases`, `expenses`, `services`, `subsidy`, `reports`, `employees`, and `settings`.
- **Server-Side Enforcement**: Server actions and API routes verify session credentials and permission codes. Unauthorized requests return HTTP 401 or HTTP 403.
- **Rate-Limiting Lockout**: Automatically triggers after 5 consecutive failed attempts, locking account for 15 minutes.
- **Account Statuses**: `Active`, `Inactive`, and `Suspended`. Deactivated staff accounts are blocked and sessions revoked.
- **Audit Logging**: Every authentication event, status change, and password reset is recorded in the `audit_logs` database table.
- **No Public Registration**: Only Super Admins can provision accounts via the `/employees` management portal.

---

## Deploying to Vercel

The project is pre-configured and 100% ready for one-click deployment to [Vercel](https://vercel.com):

### 1. Import Repository
1. Push this repository to your GitHub account (`https://github.com/Jyoti-jitu/...`).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository. Vercel will automatically detect **Next.js**.

### 2. Configure Environment Variables
In the Vercel Project Settings, add the following Environment Variables (from your `.env`):

| Variable | Description | Example / Source |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-host.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | 32+ char random secret key for sessions | Generated via `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_NAME` | Company Display Name | `AP Enerfy Solar` |

### 3. Deploy
Click **"Deploy"**. Vercel will run `next build`, compile all static and dynamic App Router routes, and assign your production domain.
