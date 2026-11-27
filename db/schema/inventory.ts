import { pgTable, uuid, text, timestamp, boolean, integer, numeric, index } from "drizzle-orm/pg-core";
import { companies, branches } from "./company";
import { users } from "./auth";

/**
 * 4. PRODUCTS & INVENTORY
 * Products, categories, brands, warehouses, stock levels, immutable movements, reservations, and serial tracking.
 */

export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. 'Waaree', 'Adani Solar', 'Tata Power Solar', 'Growatt', 'Sungrow', 'Havells'
  country: text("country").default("India"),
  website: text("website"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const taxRates = pgTable("tax_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. 'GST 5% Solar Composite', 'GST 12% Inverters', 'GST 18% Commercial'
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull(),
  cgstRate: numeric("cgst_rate", { precision: 5, scale: 2 }).notNull(),
  sgstRate: numeric("sgst_rate", { precision: 5, scale: 2 }).notNull(),
  igstRate: numeric("igst_rate", { precision: 5, scale: 2 }).notNull(),
  hsnCode: text("hsn_code"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const warehouses = pgTable("warehouses", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").references(() => branches.id, { onDelete: "set null" }),
  name: text("name").notNull(), // e.g. 'Bhubaneswar Central Depot', 'Cuttack Hub'
  code: text("code").notNull(),
  address: text("address"),
  city: text("city").notNull().default("Bhubaneswar"),
  state: text("state").default("Odisha").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => productCategories.id),
  brandId: uuid("brand_id").references(() => brands.id),
  taxRateId: uuid("tax_rate_id").references(() => taxRates.id),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(), // e.g. 'MOD-WAA-545M', 'INV-GRO-5000'
  category: text("category").notNull(), // 'Solar Panels' | 'Inverters' | 'Batteries' | 'Structure' | 'Cables & Accessories' | 'BOS'
  brand: text("brand").notNull(),
  model: text("model"),
  wattage: numeric("wattage", { precision: 8, scale: 2 }), // for panels, e.g. 545 Wp
  efficiency: numeric("efficiency", { precision: 5, scale: 2 }), // e.g. 21.3%
  capacityKw: numeric("capacity_kw", { precision: 8, scale: 2 }), // for inverters, e.g. 5.0 kW
  hsnCode: text("hsn_code").default("85414011").notNull(),
  unit: text("unit").default("Nos").notNull(), // 'Nos' | 'Meters' | 'Sets' | 'Kg'
  costPrice: numeric("cost_price", { precision: 12, scale: 2 }).default("0.00").notNull(),
  sellingPrice: numeric("selling_price", { precision: 12, scale: 2 }).default("0.00").notNull(),
  minStockAlert: integer("min_stock_alert").default(5).notNull(),
  warrantyYears: integer("warranty_years").default(25).notNull(),
  currentStock: integer("current_stock").default(0).notNull(),
  allocatedStock: integer("allocated_stock").default(0).notNull(),
  availableStock: integer("available_stock").default(0).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("products_sku_idx").on(table.sku),
  index("products_category_idx").on(table.category),
  index("products_brand_idx").on(table.brand),
]);

export const stockLevels = pgTable("stock_levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").default(0).notNull(),
  reservedQuantity: integer("reserved_quantity").default(0).notNull(),
  availableQuantity: integer("available_quantity").default(0).notNull(),
  minLevel: integer("min_level").default(5).notNull(),
  maxLevel: integer("max_level"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("stock_levels_prod_wh_idx").on(table.productId, table.warehouseId),
]);

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }).notNull(),
  movementType: text("movement_type").notNull(), // 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'ALLOCATION' | 'RETURN'
  quantity: integer("quantity").notNull(),
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  referenceType: text("reference_type"), // 'PURCHASE_RECEIPT' | 'PROJECT_INSTALLATION' | 'SALES_INVOICE' | 'MANUAL_ADJUSTMENT' | 'DAMAGE'
  referenceId: text("reference_id"),
  notes: text("notes"),
  performedById: uuid("performed_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("stock_mov_prod_idx").on(table.productId),
  index("stock_mov_wh_idx").on(table.warehouseId),
  index("stock_mov_created_idx").on(table.createdAt),
]);

export const stockReservations = pgTable("stock_reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }).notNull(),
  projectId: uuid("project_id"),
  reservedQuantity: integer("reserved_quantity").notNull(),
  status: text("status").default("Reserved").notNull(), // 'Reserved' | 'Fulfilled' | 'Cancelled'
  reservedById: uuid("reserved_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("stock_res_proj_idx").on(table.projectId),
]);

export const productSerials = pgTable("product_serials", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "restrict" }).notNull(),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id, { onDelete: "restrict" }),
  serialNumber: text("serial_number").notNull().unique(),
  status: text("status").default("In Stock").notNull(), // 'In Stock' | 'Allocated' | 'Installed' | 'Defective' | 'Returned'
  projectId: uuid("project_id"),
  installationDate: timestamp("installation_date", { withTimezone: true }),
  warrantyExpiresAt: timestamp("warranty_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("product_serials_serial_idx").on(table.serialNumber),
  index("product_serials_prod_idx").on(table.productId),
]);
