try {
  process.loadEnvFile?.(".env");
} catch {}

import { db, schema, runMigrations } from "./index";
import bcrypt from "bcryptjs";
import { PERMISSIONS, ROLES } from "../lib/rbac";
import { eq } from "drizzle-orm";

/**
 * Foundation Seed for AP Enerfy Solar ERP & Billing Management Software
 *
 * Sets up clean master data:
 * - Default Company (AP Enerfy Solar Pvt Ltd)
 * - Default Headquarters & Regional Branches (Bhubaneswar, Cuttack, Puri)
 * - Financial Years (FY 2024-25, FY 2025-26)
 * - Document Sequence Generators
 * - Company Master Settings
 * - GST Tax Brackets (5%, 12%, 18%, 0%)
 * - Standard Double-Entry Chart of Accounts (COA)
 * - Master Product Categories, Brands, and Warehouses
 * - Master Expense Categories
 * - Granular RBAC Permissions (100% of defined system permissions)
 * - All 7 System Roles (Super Admin, Accountant, Sales Executive, Storekeeper,
 *   Installation Engineer, Service Technician, Branch Manager)
 * - Role-to-Permission Mappings
 * - Initial Super Admin Account (admin@apenerfy.com / password123)
 *
 * NOTE: Strictly zero fake customers, zero fake invoices, zero fake payments,
 * and zero fake inventory balances are created in this foundation seed.
 */

export async function seedFoundation() {
  console.log("=========================================================");
  console.log("AP Enerfy Solar ERP - Clean Database Foundation Seeding");
  console.log("=========================================================");

  console.log("\n[1/10] Verifying database schema & running pending migrations...");
  await runMigrations();

  console.log("\n[2/10] Seeding Master Company Profile...");
  // 1. Company
  let [company] = await db
    .select()
    .from(schema.companies)
    .where(eq(schema.companies.code, "APES"));

  if (!company) {
    const [inserted] = await db
      .insert(schema.companies)
      .values({
        name: "AP Enerfy Solar Pvt Ltd",
        legalName: "AP Enerfy Solar Private Limited",
        code: "APES",
        gstin: "21AAACA1234A1Z5",
        pan: "AAACA1234A",
        cin: "U40106OR2023PTC042890",
        state: "Odisha",
        stateCode: "21",
        email: "contact@apenerfy.com",
        phone: "+91 674 2548900",
        website: "https://apenerfysolar.com",
        address: "Plot No. 104, Infocity Avenue, Patia, Bhubaneswar, Odisha 751024",
        currency: "INR",
        isActive: true,
      })
      .returning();
    company = inserted;
    console.log(`✓ Created Company: ${company.name} (${company.code})`);
  } else {
    console.log(`✓ Company already exists: ${company.name} (${company.code})`);
  }

  console.log("\n[3/10] Seeding Master Branches...");
  // 2. Branches
  const branchDefs = [
    {
      name: "Bhubaneswar HQ",
      code: "BBSR",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751024",
      address: "Plot No. 104, Infocity Avenue, Patia, Bhubaneswar",
      phone: "+91 94370 11456",
      email: "bbsr@apenerfy.com",
      gstin: "21AAACA1234A1Z5",
      isHeadquarters: true,
      isActive: true,
    },
    {
      name: "Cuttack Regional Branch",
      code: "CTC",
      city: "Cuttack",
      state: "Odisha",
      pincode: "753012",
      address: "Link Road, Badambadi, Cuttack",
      phone: "+91 99370 22456",
      email: "cuttack@apenerfy.com",
      gstin: "21AAACA1234A1Z5",
      isHeadquarters: false,
      isActive: true,
    },
    {
      name: "Puri Coastal Branch",
      code: "PURI",
      city: "Puri",
      state: "Odisha",
      pincode: "752002",
      address: "VIP Road, Near Bus Stand, Puri",
      phone: "+91 88950 33441",
      email: "puri@apenerfy.com",
      gstin: "21AAACA1234A1Z5",
      isHeadquarters: false,
      isActive: true,
    },
  ];

  const branchMap = new Map<string, string>();
  for (const b of branchDefs) {
    const existing = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.code, b.code));

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(schema.branches)
        .values({
          companyId: company.id,
          ...b,
        })
        .returning();
      branchMap.set(b.code, inserted.id);
      console.log(`✓ Created Branch: ${b.name} (${b.code})`);
    } else {
      branchMap.set(b.code, existing[0].id);
      console.log(`✓ Branch already exists: ${b.name} (${b.code})`);
    }
  }

  const hqBranchId = branchMap.get("BBSR")!;

  console.log("\n[4/10] Seeding Financial Years & Document Sequences...");
  // 3. Financial Years (April 1 to March 31)
  const fyDefs = [
    {
      code: "2024-2025",
      name: "FY 2024-25",
      startDate: new Date("2024-04-01T00:00:00.000Z"),
      endDate: new Date("2025-03-31T23:59:59.999Z"),
      isCurrent: true,
      isLocked: false,
    },
    {
      code: "2025-2026",
      name: "FY 2025-26",
      startDate: new Date("2025-04-01T00:00:00.000Z"),
      endDate: new Date("2026-03-31T23:59:59.999Z"),
      isCurrent: false,
      isLocked: false,
    },
  ];

  let currentFyId: string = "";
  for (const fy of fyDefs) {
    const existing = await db
      .select()
      .from(schema.financialYears)
      .where(eq(schema.financialYears.code, fy.code));

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(schema.financialYears)
        .values({
          companyId: company.id,
          ...fy,
        })
        .returning();
      if (fy.isCurrent) currentFyId = inserted.id;
      console.log(`✓ Created Financial Year: ${fy.name} (${fy.code})`);
    } else {
      if (fy.isCurrent) currentFyId = existing[0].id;
      console.log(`✓ Financial Year exists: ${fy.name}`);
    }
  }

  // 4. Document Sequences for FY 2024-25
  const sequenceDefs = [
    { documentType: "INVOICE", prefix: "INV-2425-", padding: 4 },
    { documentType: "QUOTATION", prefix: "QTN-2425-", padding: 4 },
    { documentType: "PROJECT", prefix: "PRJ-2425-", padding: 4 },
    { documentType: "PAYMENT", prefix: "RCT-2425-", padding: 4 },
    { documentType: "PURCHASE_ORDER", prefix: "PO-2425-", padding: 4 },
    { documentType: "CHALLAN", prefix: "DC-2425-", padding: 4 },
    { documentType: "CREDIT_NOTE", prefix: "CN-2425-", padding: 4 },
    { documentType: "DEBIT_NOTE", prefix: "DN-2425-", padding: 4 },
    { documentType: "LEAD", prefix: "LD-2425-", padding: 4 },
    { documentType: "SERVICE", prefix: "SRV-2425-", padding: 4 },
  ];

  for (const seq of sequenceDefs) {
    const existing = await db
      .select()
      .from(schema.documentSequences)
      .where(eq(schema.documentSequences.documentType, seq.documentType));

    if (existing.length === 0) {
      await db.insert(schema.documentSequences).values({
        companyId: company.id,
        branchId: hqBranchId,
        financialYearId: currentFyId,
        documentType: seq.documentType,
        prefix: seq.prefix,
        currentNumber: 0,
        padding: seq.padding,
      });
    }
  }
  console.log(`✓ Initialized 10 standard document sequence generators`);

  // 5. Master Company Settings
  const defaultSettings = [
    { key: "general.company_name", value: "AP Enerfy Solar Pvt Ltd", desc: "Company Display Name" },
    { key: "general.currency", value: "INR", desc: "Base Currency" },
    { key: "general.currency_symbol", value: "₹", desc: "Currency Symbol" },
    { key: "tax.default_hsn", value: "85414011", desc: "Default HSN for Solar PV" },
    { key: "tax.default_rate", value: "12", desc: "Standard Solar GST Rate (%)" },
    { key: "invoice.terms", value: "1. Warranty covers solar modules for 25 years performance. 2. Inverter warranty 5 years. 3. Net metering subject to DISCOM inspection approval.", desc: "Invoice standard footer terms" },
    { key: "solar.discoms", value: "TPCODL,TPNODL,TPSODL,TPWODL", desc: "Supported Odisha Power Distribution Companies" },
  ];

  for (const setting of defaultSettings) {
    const existing = await db
      .select()
      .from(schema.companySettings)
      .where(eq(schema.companySettings.settingKey, setting.key));

    if (existing.length === 0) {
      await db.insert(schema.companySettings).values({
        companyId: company.id,
        settingKey: setting.key,
        settingValue: setting.value,
        description: setting.desc,
      });
    }
  }
  console.log(`✓ Initialized system configuration settings`);

  console.log("\n[5/10] Seeding Master GST Tax Rates...");
  // 6. Tax Rates
  const taxDefs = [
    { name: "GST 5% Solar Composite", rate: "5.00", cgstRate: "2.50", sgstRate: "2.50", igstRate: "5.00", hsnCode: "85414011", isDefault: false },
    { name: "GST 12% Solar Modules & PV", rate: "12.00", cgstRate: "6.00", sgstRate: "6.00", igstRate: "12.00", hsnCode: "85414011", isDefault: true },
    { name: "GST 18% Inverters & Equipment", rate: "18.00", cgstRate: "9.00", sgstRate: "9.00", igstRate: "18.00", hsnCode: "85044090", isDefault: false },
    { name: "GST 0% Exempt Services", rate: "0.00", cgstRate: "0.00", sgstRate: "0.00", igstRate: "0.00", hsnCode: "9987", isDefault: false },
  ];

  for (const t of taxDefs) {
    const existing = await db
      .select()
      .from(schema.taxRates)
      .where(eq(schema.taxRates.name, t.name));

    if (existing.length === 0) {
      await db.insert(schema.taxRates).values({
        companyId: company.id,
        ...t,
      });
    }
  }
  console.log(`✓ Initialized 4 GST tax brackets`);

  console.log("\n[6/10] Seeding Standard Chart of Accounts (COA)...");
  // 7. Standard Double-Entry General Ledger Accounts
  const coaDefs = [
    { code: "1001", name: "Cash in Hand", type: "Asset", isSystem: true },
    { code: "1002", name: "HDFC Bank Operating Account", type: "Asset", isSystem: true },
    { code: "1100", name: "Accounts Receivable (Debtors)", type: "Asset", isSystem: true },
    { code: "1200", name: "Solar Equipment Inventory Stock", type: "Asset", isSystem: true },
    { code: "2001", name: "Accounts Payable (Creditors)", type: "Liability", isSystem: true },
    { code: "2101", name: "Output CGST Payable", type: "Liability", isSystem: true },
    { code: "2102", name: "Output SGST Payable", type: "Liability", isSystem: true },
    { code: "2103", name: "Output IGST Payable", type: "Liability", isSystem: true },
    { code: "2201", name: "Customer Advance Deposits", type: "Liability", isSystem: true },
    { code: "3001", name: "Equity Share Capital", type: "Equity", isSystem: true },
    { code: "3002", name: "Retained Earnings", type: "Equity", isSystem: true },
    { code: "4001", name: "Solar Rooftop Installation Sales", type: "Revenue", isSystem: true },
    { code: "4002", name: "Solar Equipment & Inverter Sales", type: "Revenue", isSystem: true },
    { code: "4003", name: "AMC & Solar Maintenance Revenue", type: "Revenue", isSystem: true },
    { code: "4004", name: "Subsidy Facilitation Service Fee", type: "Revenue", isSystem: true },
    { code: "5001", name: "Direct Cost of Solar Goods (COGS)", type: "Expense", isSystem: true },
    { code: "5002", name: "Site Civil Works & Installation Labour", type: "Expense", isSystem: true },
    { code: "5003", name: "Structure Transportation & Logistics", type: "Expense", isSystem: true },
    { code: "5101", name: "Office Rent & Utilities", type: "Expense", isSystem: true },
    { code: "5102", name: "Staff Salaries & Allowances", type: "Expense", isSystem: true },
  ];

  for (const ac of coaDefs) {
    const existing = await db
      .select()
      .from(schema.accounts)
      .where(eq(schema.accounts.accountCode, ac.code));

    if (existing.length === 0) {
      await db.insert(schema.accounts).values({
        companyId: company.id,
        accountCode: ac.code,
        accountName: ac.name,
        accountType: ac.type,
        currency: "INR",
        currentBalance: "0.00",
        isSystem: ac.isSystem,
        isActive: true,
      });
    }
  }
  console.log(`✓ Initialized Chart of Accounts (${coaDefs.length} accounts)`);

  console.log("\n[7/10] Seeding Master Product Categories, Brands & Warehouses...");
  // 8. Product Categories
  const categoryDefs = [
    { name: "Solar Panels", code: "PANELS", description: "Mono PERC, TOPCon & Bifacial Solar PV Modules" },
    { name: "Solar Inverters", code: "INVERTERS", description: "Grid-Tied, Hybrid & Micro Inverters" },
    { name: "Solar Batteries", code: "BATTERIES", description: "Lithium Ferro Phosphate (LFP) & Solar Gel Batteries" },
    { name: "Mounting Structure", code: "STRUCTURE", description: "Galvanized Iron & Aluminium Rooftop Mounting Structures" },
    { name: "Cables & BOS", code: "CABLES_BOS", description: "Solar DC Cables, ACDB, DCDB & Lightning Arrestors" },
  ];

  for (const cat of categoryDefs) {
    const existing = await db
      .select()
      .from(schema.productCategories)
      .where(eq(schema.productCategories.code, cat.code));

    if (existing.length === 0) {
      await db.insert(schema.productCategories).values({
        companyId: company.id,
        ...cat,
        isActive: true,
      });
    }
  }

  // 9. Brands
  const brandDefs = [
    { name: "Waaree Energies", country: "India", website: "https://waaree.com" },
    { name: "Adani Solar", country: "India", website: "https://adanisolar.com" },
    { name: "Tata Power Solar", country: "India", website: "https://tatapowersolar.com" },
    { name: "Growatt", country: "Global", website: "https://growatt.com" },
    { name: "Sungrow", country: "Global", website: "https://sungrowpower.com" },
    { name: "Polycab Solar", country: "India", website: "https://polycab.com" },
  ];

  for (const b of brandDefs) {
    const existing = await db
      .select()
      .from(schema.brands)
      .where(eq(schema.brands.name, b.name));

    if (existing.length === 0) {
      await db.insert(schema.brands).values({
        companyId: company.id,
        ...b,
        isActive: true,
      });
    }
  }

  // 10. Warehouses
  const warehouseDefs = [
    { name: "Central Solar Depot - Bhubaneswar", code: "WH-BBSR-01", address: "Plot No. 104, Infocity Avenue, Patia", city: "Bhubaneswar", state: "Odisha", isDefault: true, branchId: hqBranchId },
    { name: "Regional Hub Depot - Cuttack", code: "WH-CTC-01", address: "Link Road, Badambadi", city: "Cuttack", state: "Odisha", isDefault: false, branchId: branchMap.get("CTC") },
  ];

  for (const wh of warehouseDefs) {
    const existing = await db
      .select()
      .from(schema.warehouses)
      .where(eq(schema.warehouses.code, wh.code));

    if (existing.length === 0) {
      await db.insert(schema.warehouses).values({
        companyId: company.id,
        ...wh,
        isActive: true,
      });
    }
  }

  // 11. Expense Categories
  const expCatDefs = [
    { name: "Site Survey & Travel", code: "EXP-SURVEY", description: "Engineer site travel and shadow analysis" },
    { name: "Structure Transportation & Freight", code: "EXP-LOGISTICS", description: "Module & mounting frame transportation" },
    { name: "Civil Works & Installation Labour", code: "EXP-LABOUR", description: "Foundation civil work, structure fixing & wiring" },
    { name: "Safety Gear & Tools", code: "EXP-SAFETY", description: "Harness, safety shoes, multimeter & torque tools" },
    { name: "Office Admin & Utilities", code: "EXP-ADMIN", description: "Internet, electricity, and office operational supplies" },
  ];

  for (const ec of expCatDefs) {
    const existing = await db
      .select()
      .from(schema.expenseCategories)
      .where(eq(schema.expenseCategories.code, ec.code));

    if (existing.length === 0) {
      await db.insert(schema.expenseCategories).values({
        companyId: company.id,
        ...ec,
        isActive: true,
      });
    }
  }
  console.log(`✓ Initialized master product categories, brands, warehouses, and expense categories`);

  console.log("\n[8/10] Seeding Granular RBAC Permissions...");
  // 12. Permissions
  const permMap = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    const existing = await db
      .select()
      .from(schema.permissions)
      .where(eq(schema.permissions.code, perm.code));

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(schema.permissions)
        .values({
          code: perm.code,
          name: perm.name,
          resource: perm.resource,
          action: perm.action,
          description: perm.description,
        })
        .returning();
      permMap.set(inserted.code, inserted.id);
    } else {
      permMap.set(existing[0].code, existing[0].id);
    }
  }
  console.log(`✓ Total Permissions in Database: ${permMap.size}`);

  console.log("\n[9/10] Seeding System Roles & Role Permissions...");
  // 13. Roles
  const roleMap = new Map<string, string>();
  for (const [slug, role] of Object.entries(ROLES)) {
    const existing = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.slug, slug));

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(schema.roles)
        .values({
          name: role.name,
          slug: role.slug,
          description: role.description,
          isSystem: true,
        })
        .returning();
      roleMap.set(slug, inserted.id);
      console.log(`✓ Created Role: ${role.name}`);
    } else {
      roleMap.set(slug, existing[0].id);
      console.log(`✓ Role exists: ${role.name}`);
    }
  }

  // 14. Role-Permission mappings
  let totalRolePerms = 0;
  for (const [slug, role] of Object.entries(ROLES)) {
    const roleId = roleMap.get(slug);
    if (!roleId) continue;

    for (const permCode of role.permissions) {
      const permId = permMap.get(permCode);
      if (!permId) continue;

      try {
        await db
          .insert(schema.rolePermissions)
          .values({
            roleId,
            permissionId: permId,
          })
          .onConflictDoNothing();
        totalRolePerms++;
      } catch (e) {
        // Ignored if already mapped
      }
    }
  }
  console.log(`✓ Configured ${totalRolePerms} role-permission mappings across 7 system roles`);

  console.log("\n[10/10] Seeding Initial Super Admin Account...");
  // 15. Initial Super Admin User
  const defaultPasswordHash = await bcrypt.hash("password123", 10);
  const adminEmail = "admin@apenerfy.com";

  let [adminUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, adminEmail));

  if (!adminUser) {
    const [inserted] = await db
      .insert(schema.users)
      .values({
        companyId: company.id,
        branchId: hqBranchId,
        name: "Super Admin",
        email: adminEmail,
        username: "superadmin",
        passwordHash: defaultPasswordHash,
        role: "super_admin",
        phone: "+91 94370 11456",
        isActive: true,
        status: "Active",
        mustChangePassword: false,
      })
      .returning();
    adminUser = inserted;
    console.log(`✓ Created Initial Super Admin: ${adminUser.email}`);
  } else {
    console.log(`✓ Super Admin user already exists: ${adminUser.email}`);
  }

  // 16. Map User to Super Admin Role
  const superAdminRoleId = roleMap.get("super_admin");
  if (superAdminRoleId && adminUser) {
    try {
      await db
        .insert(schema.userRoles)
        .values({
          userId: adminUser.id,
          roleId: superAdminRoleId,
        })
        .onConflictDoNothing();
      console.log(`✓ Mapped Super Admin role to user ${adminUser.email}`);
    } catch (e) {}
  }

  console.log("\n=========================================================");
  console.log("✓ AP Enerfy Solar Clean Database Foundation Seeding Completed!");
  console.log("  Super Admin Email: admin@apenerfy.com");
  console.log("  Default Password:  password123");
  console.log("  Default Company:   AP Enerfy Solar Pvt Ltd (APES)");
  console.log("  Headquarters:      Bhubaneswar HQ (BBSR)");
  console.log("  Financial Year:    FY 2024-25 (Current)");
  console.log("  Operational Data:  Strictly clean (0 fake customers, 0 fake invoices)");
  console.log("=========================================================\n");

  return {
    companyId: company.id,
    hqBranchId,
    adminUserId: adminUser.id,
  };
}

if (require.main === module || process.argv[1]?.endsWith("seed-foundation.ts")) {
  seedFoundation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Foundation seed error:", err);
      process.exit(1);
    });
}
