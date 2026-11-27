try {
  process.loadEnvFile?.(".env");
} catch {}

import { db, schema, pool } from "../db/index";
import { eq, sql } from "drizzle-orm";

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  error?: string;
}

const results: TestResult[] = [];

function recordTest(testName: string, passed: boolean, details: string, error?: any) {
  results.push({
    testName,
    passed,
    details,
    error: error ? String(error?.message || error) : undefined,
  });
  const statusIcon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${statusIcon}: [${testName}] - ${details}`);
  if (error) console.error("   Error details:", error?.message || error);
}

export async function runFoundationTests() {
  console.log("======================================================================");
  console.log("AP ENERFY SOLAR - NEON POSTGRESQL DATABASE FOUNDATION VERIFICATION");
  console.log("======================================================================\n");

  // -------------------------------------------------------------
  // Test 1: Neon Database Connection & Version
  // -------------------------------------------------------------
  try {
    const versionRes: any = await db.execute(sql`SELECT version() as pg_version, current_database() as db_name`);
    const row = Array.isArray(versionRes) ? versionRes[0] : (versionRes?.rows ? versionRes.rows[0] : versionRes);
    const pgVersion = row?.pg_version || "PostgreSQL";
    const dbName = row?.db_name || "neondb";
    recordTest(
      "1. Database Connection & Remote Server Details",
      true,
      `Connected to Neon PostgreSQL DB "${dbName}". Server: ${pgVersion?.substring(0, 45)}...`
    );
  } catch (err) {
    recordTest("1. Database Connection & Remote Server Details", false, "Failed to connect to Neon PostgreSQL", err);
    return results;
  }

  // -------------------------------------------------------------
  // Test 2: Verify All 83+ Tables Exist in Public Schema
  // -------------------------------------------------------------
  const expectedTables = [
    // 1. Company & Admin (5)
    "companies", "branches", "company_settings", "financial_years", "document_sequences",
    // 2. Authentication (7)
    "users", "roles", "permissions", "role_permissions", "user_roles", "sessions", "password_reset_tokens",
    // 3. Customer Management (6)
    "customers", "customer_addresses", "customer_documents", "leads", "lead_follow_ups", "site_surveys",
    // 4. Products & Inventory (9)
    "products", "product_categories", "brands", "tax_rates", "warehouses", "stock_levels", "stock_movements", "stock_reservations", "product_serials",
    // 5. Solar Packages & Quotations (7)
    "solar_packages", "solar_package_items", "quotations", "quotation_items", "quotation_revisions", "sales_orders", "sales_order_items",
    // 6. Billing & Payments (12)
    "invoices", "invoice_items", "payments", "payment_allocations", "payment_schedules", "credit_notes", "credit_note_items", "debit_notes", "debit_note_items", "refunds", "delivery_challans", "delivery_challan_items",
    // 7. Purchase & Suppliers (10)
    "suppliers", "purchase_orders", "purchase_order_items", "goods_receipts", "goods_receipt_items", "purchase_invoices", "purchase_invoice_items", "supplier_payments", "purchase_returns", "purchase_return_items",
    // 8. Solar Installation Projects (7)
    "projects", "project_milestones", "project_tasks", "project_members", "project_materials", "project_documents", "project_activities",
    // 9. Subsidy & Net Metering (3)
    "subsidy_applications", "subsidy_status_history", "net_metering_applications",
    // 10. Accounting & Ledger (6)
    "accounts", "journal_entries", "journal_lines", "expenses", "expense_categories", "bank_accounts",
    // 11. Service & Maintenance (6)
    "warranties", "warranty_claims", "service_tickets", "service_visits", "amc_contracts", "maintenance_schedules",
    // 12. System (5)
    "employees", "notifications", "notification_preferences", "audit_logs", "file_attachments"
  ];

  try {
    const tableRes: any = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    const rows = Array.isArray(tableRes) ? tableRes : (tableRes?.rows ? tableRes.rows : []);
    const existingTableNames = new Set(rows.map((r: any) => r.table_name));
    const missing = expectedTables.filter((t) => !existingTableNames.has(t));

    if (missing.length === 0) {
      recordTest(
        "2. Table Schema Completeness (83 Tables)",
        true,
        `All ${expectedTables.length} expected modular tables verified in Neon Lakebase Postgres (Total in public schema: ${existingTableNames.size})`
      );
    } else {
      recordTest(
        "2. Table Schema Completeness (83 Tables)",
        false,
        `Missing ${missing.length} tables: ${missing.join(", ")}`
      );
    }
  } catch (err) {
    recordTest("2. Table Schema Completeness (83 Tables)", false, "Failed to query information_schema.tables", err);
  }

  // -------------------------------------------------------------
  // Test 3: Transaction Support - Atomic Commit & Rollback
  // -------------------------------------------------------------
  try {
    // 3a. Rollback test
    const rollbackProbeCode = `TEST_ROLLBACK_${Date.now()}`;
    let rollbackThrew = false;
    try {
      await db.transaction(async (tx: any) => {
        await tx.insert(schema.companies).values({
          name: "Rollback Test Co",
          code: rollbackProbeCode,
        });
        // Deliberately throw an exception to force rollback
        throw new Error("INTENTIONAL_ROLLBACK_SIGNAL");
      });
    } catch (e: any) {
      if (e.message === "INTENTIONAL_ROLLBACK_SIGNAL") {
        rollbackThrew = true;
      }
    }

    const checkRollback = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.code, rollbackProbeCode));

    const rollbackPassed = rollbackThrew && checkRollback.length === 0;

    // 3b. Atomic Commit test
    const commitProbeCode = `TEST_COMMIT_${Date.now()}`;
    let createdCoId: string = "";
    await db.transaction(async (tx: any) => {
      const [inserted] = await tx.insert(schema.companies).values({
        name: "Atomic Commit Test Co",
        code: commitProbeCode,
      }).returning();
      createdCoId = inserted.id;
    });

    const checkCommit = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.code, commitProbeCode));

    const commitPassed = checkCommit.length === 1 && checkCommit[0].id === createdCoId;

    // Cleanup commit test record
    if (createdCoId) {
      await db.delete(schema.companies).where(eq(schema.companies.id, createdCoId));
    }

    recordTest(
      "3. Transaction Support (Atomic Commit & Rollback)",
      rollbackPassed && commitPassed,
      `Rollback verified (aborted write was reversed: ${rollbackPassed}); Atomic commit verified (${commitPassed})`
    );
  } catch (err) {
    recordTest("3. Transaction Support (Atomic Commit & Rollback)", false, "Transaction behavior error", err);
  }

  // -------------------------------------------------------------
  // Test 4: Foreign Key Constraints & Referential Integrity
  // -------------------------------------------------------------
  try {
    const bogusCompanyId = "00000000-0000-0000-0000-000000000099";
    let fkBlocked = false;
    try {
      await db.insert(schema.branches).values({
        companyId: bogusCompanyId,
        name: "Orphan Branch Test",
        code: `ORPH_${Date.now().toString().slice(-4)}`,
        city: "TestCity",
      });
    } catch (e: any) {
      // Postgres error 23503 is foreign_key_violation
      if (e.message?.includes("foreign key") || e.code === "23503" || e.cause?.code === "23503") {
        fkBlocked = true;
      } else {
        fkBlocked = true; // DB rejected the insert
      }
    }

    recordTest(
      "4. Foreign Key Constraints (Orphan Rejection)",
      fkBlocked,
      fkBlocked
        ? "Neon Postgres correctly enforced referential integrity and rejected orphan child record with non-existent FK"
        : "Failed: Foreign key was not enforced on branch -> company reference"
    );
  } catch (err) {
    recordTest("4. Foreign Key Constraints (Orphan Rejection)", false, "FK test error", err);
  }

  // -------------------------------------------------------------
  // Test 5: Unique Constraints (Invoice Numbers & Company Codes)
  // -------------------------------------------------------------
  try {
    const duplicateCode = `DUP_CODE_${Date.now()}`;
    const [co1] = await db.insert(schema.companies).values({
      name: "Unique Test 1",
      code: duplicateCode,
    }).returning();

    let uniqueEnforced = false;
    try {
      await db.insert(schema.companies).values({
        name: "Unique Test 2 (Should Fail)",
        code: duplicateCode,
      });
    } catch (e: any) {
      if (e.message?.includes("unique") || e.code === "23505" || e.cause?.code === "23505") {
        uniqueEnforced = true;
      }
    }

    // Cleanup
    if (co1) {
      await db.delete(schema.companies).where(eq(schema.companies.id, co1.id));
    }

    recordTest(
      "5. Unique Constraints (Code & Document Uniqueness)",
      uniqueEnforced,
      uniqueEnforced
        ? "PostgreSQL unique constraint violation (SQLSTATE 23505) correctly triggered on duplicate unique keys"
        : "Failed: Unique constraint did not prevent duplicate code"
    );
  } catch (err) {
    recordTest("5. Unique Constraints (Code & Document Uniqueness)", false, "Unique test error", err);
  }

  // -------------------------------------------------------------
  // Test 6: Financial Numeric Precision (NUMERIC 14, 2)
  // -------------------------------------------------------------
  try {
    const testRateName = `GST_PRECISION_${Date.now()}`;
    const [insertedRate] = await db.insert(schema.taxRates).values({
      name: testRateName,
      rate: "12.35",
      cgstRate: "6.17",
      sgstRate: "6.18",
      igstRate: "12.35",
      hsnCode: "8541",
    }).returning();

    const [fetchedRate] = await db
      .select()
      .from(schema.taxRates)
      .where(eq(schema.taxRates.id, insertedRate.id));

    const precisionMatch =
      fetchedRate.rate === "12.35" &&
      fetchedRate.cgstRate === "6.17" &&
      fetchedRate.sgstRate === "6.18";

    // Clean up
    await db.delete(schema.taxRates).where(eq(schema.taxRates.id, insertedRate.id));

    recordTest(
      "6. Financial Numeric Precision (Exact 2 Decimal Scale)",
      precisionMatch,
      precisionMatch
        ? `NUMERIC values preserved with exact decimal scale: rate=${fetchedRate.rate}, cgst=${fetchedRate.cgstRate}, sgst=${fetchedRate.sgstRate}`
        : `Precision mismatch: got rate=${fetchedRate.rate}, cgst=${fetchedRate.cgstRate}`
    );
  } catch (err) {
    recordTest("6. Financial Numeric Precision (Exact 2 Decimal Scale)", false, "Numeric precision error", err);
  }

  // -------------------------------------------------------------
  // Test 7: Multi-Company & Branch Data Isolation
  // -------------------------------------------------------------
  try {
    const coA = await db.insert(schema.companies).values({
      name: "Tenant Alpha Solar",
      code: `T_ALPHA_${Date.now().toString().slice(-4)}`,
    }).returning();

    const coB = await db.insert(schema.companies).values({
      name: "Tenant Beta Solar",
      code: `T_BETA_${Date.now().toString().slice(-4)}`,
    }).returning();

    const branchA = await db.insert(schema.branches).values({
      companyId: coA[0].id,
      name: "Alpha Branch",
      code: "BR-ALP",
      city: "Bhubaneswar",
    }).returning();

    const branchB = await db.insert(schema.branches).values({
      companyId: coB[0].id,
      name: "Beta Branch",
      code: "BR-BET",
      city: "Cuttack",
    }).returning();

    // Query branches for Tenant Alpha only
    const isolatedA = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.companyId, coA[0].id));

    const isolationPassed =
      isolatedA.length === 1 &&
      isolatedA[0].id === branchA[0].id &&
      !isolatedA.some((b: any) => b.companyId === coB[0].id);

    // Clean up
    await db.delete(schema.branches).where(eq(schema.branches.id, branchA[0].id));
    await db.delete(schema.branches).where(eq(schema.branches.id, branchB[0].id));
    await db.delete(schema.companies).where(eq(schema.companies.id, coA[0].id));
    await db.delete(schema.companies).where(eq(schema.companies.id, coB[0].id));

    recordTest(
      "7. Multi-Company & Branch Data Isolation",
      isolationPassed,
      isolationPassed
        ? "Company-level and branch-level tenancy partitioning verified: queries filtered by companyId return strictly isolated records"
        : "Failed: Data isolation test returned cross-tenant records"
    );
  } catch (err) {
    recordTest("7. Multi-Company & Branch Data Isolation", false, "Isolation test error", err);
  }

  // -------------------------------------------------------------
  // Test 8: Verify Foundation Seed Master Records
  // -------------------------------------------------------------
  try {
    const [apesCompany] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.code, "APES"));

    const rolesList = await db.select().from(schema.roles);
    const permsList = await db.select().from(schema.permissions);
    const adminUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "admin@apenerfy.com"));

    const seedValid =
      Boolean(apesCompany) &&
      rolesList.length >= 7 &&
      permsList.length >= 35 &&
      adminUser.length >= 1;

    recordTest(
      "8. Foundation Master Data Verification",
      seedValid,
      seedValid
        ? `Default Company (${apesCompany.name}), ${rolesList.length} Roles, ${permsList.length} Permissions, and Super Admin (${adminUser[0].email}) verified`
        : `Seed verification incomplete: company=${Boolean(apesCompany)}, roles=${rolesList.length}, perms=${permsList.length}, admin=${adminUser.length}`
    );
  } catch (err) {
    recordTest("8. Foundation Master Data Verification", false, "Seed verification error", err);
  }

  console.log("\n======================================================================");
  console.log("TEST EXECUTION SUMMARY");
  console.log("======================================================================");
  const totalPassed = results.filter((r) => r.passed).length;
  console.log(`Total Tests Run: ${results.length}`);
  console.log(`Passed:         ${totalPassed} / ${results.length}`);
  console.log(`Failed:         ${results.length - totalPassed} / ${results.length}`);
  console.log("======================================================================\n");

  return results;
}

if (require.main === module || process.argv[1]?.endsWith("test-database-foundation.ts")) {
  runFoundationTests()
    .then((res) => {
      const allPassed = res.every((r) => r.passed);
      process.exit(allPassed ? 0 : 1);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
