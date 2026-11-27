/**
 * Role-Based Access Control (RBAC) definitions and permission helpers for AP Enerfy Solar
 * Granular resource.action permissions with deny-by-default enterprise authorization.
 */

export interface PermissionDefinition {
  code: string;
  name: string;
  resource: string;
  action: string;
  module: string;
  description: string;
}

export interface RoleDefinition {
  name: string;
  slug: string;
  description: string;
  defaultPath: string;
  permissions: string[];
}

export const PERMISSION_MODULES = [
  "Dashboard",
  "Customers",
  "Leads",
  "Quotations",
  "Invoices",
  "Payments",
  "Inventory",
  "Purchases",
  "Projects",
  "Subsidy",
  "Accounting",
  "Service",
  "Reports",
  "Employees",
  "Settings",
] as const;

export const PERMISSIONS: PermissionDefinition[] = [
  // Dashboard
  { code: 'dashboard.view', name: 'View Dashboard', resource: 'dashboard', action: 'view', module: 'Dashboard', description: 'Access enterprise dashboard analytics & KPIs' },

  // Customers
  { code: 'customers.view', name: 'View Customers', resource: 'customers', action: 'view', module: 'Customers', description: 'View consumer directory and details' },
  { code: 'customers.create', name: 'Create Customers', resource: 'customers', action: 'create', module: 'Customers', description: 'Register new solar rooftop consumers' },
  { code: 'customers.update', name: 'Update Customers', resource: 'customers', action: 'update', module: 'Customers', description: 'Modify consumer profile & load data' },
  { code: 'customers.archive', name: 'Archive Customers', resource: 'customers', action: 'archive', module: 'Customers', description: 'Archive obsolete consumer records' },
  { code: 'customers.export', name: 'Export Customers', resource: 'customers', action: 'export', module: 'Customers', description: 'Export consumer registry to Excel/CSV' },

  // Leads & Enquiries
  { code: 'leads.view', name: 'View Leads', resource: 'leads', action: 'view', module: 'Leads', description: 'View solar lead pipeline & enquiries' },
  { code: 'leads.create', name: 'Create Leads', resource: 'leads', action: 'create', module: 'Leads', description: 'Capture new rooftop solar lead' },
  { code: 'leads.assign', name: 'Assign Leads', resource: 'leads', action: 'assign', module: 'Leads', description: 'Assign leads to sales representatives' },
  { code: 'leads.convert', name: 'Convert Leads', resource: 'leads', action: 'convert', module: 'Leads', description: 'Convert qualified leads to customers' },

  // Quotations & Proposals
  { code: 'quotations.view', name: 'View Quotations', resource: 'quotations', action: 'view', module: 'Quotations', description: 'View solar proposals and system sizing' },
  { code: 'quotations.create', name: 'Create Quotations', resource: 'quotations', action: 'create', module: 'Quotations', description: 'Draft proposals with subsidy breakdown' },
  { code: 'quotations.update', name: 'Update Quotations', resource: 'quotations', action: 'update', module: 'Quotations', description: 'Revise solar quotation pricing & specs' },
  { code: 'quotations.approve', name: 'Approve Quotations', resource: 'quotations', action: 'approve', module: 'Quotations', description: 'Formally approve commercial quotations' },
  { code: 'quotations.convert', name: 'Convert to Sales Order', resource: 'quotations', action: 'convert', module: 'Quotations', description: 'Convert approved quote to confirmed sales order' },

  // Invoices & Billing
  { code: 'invoices.view', name: 'View Invoices', resource: 'invoices', action: 'view', module: 'Invoices', description: 'View GST tax invoices and proforma' },
  { code: 'invoices.create', name: 'Create Invoices', resource: 'invoices', action: 'create', module: 'Invoices', description: 'Generate draft tax invoices with GST' },
  { code: 'invoices.update_draft', name: 'Update Draft Invoices', resource: 'invoices', action: 'update_draft', module: 'Invoices', description: 'Modify draft invoice line items' },
  { code: 'invoices.finalize', name: 'Finalize Invoices', resource: 'invoices', action: 'finalize', module: 'Invoices', description: 'Lock and finalize invoice for dispatch' },
  { code: 'invoices.cancel', name: 'Cancel Invoices', resource: 'invoices', action: 'cancel', module: 'Invoices', description: 'Void or cancel generated invoices' },
  { code: 'invoices.export', name: 'Export Invoices', resource: 'invoices', action: 'export', module: 'Invoices', description: 'Export sales register & GST summary' },

  // Payments & Receipts
  { code: 'payments.view', name: 'View Payments', resource: 'payments', action: 'view', module: 'Payments', description: 'View customer receipts and collections' },
  { code: 'payments.create', name: 'Record Payments', resource: 'payments', action: 'create', module: 'Payments', description: 'Record advance & milestone payment receipts' },
  { code: 'payments.allocate', name: 'Allocate Payments', resource: 'payments', action: 'allocate', module: 'Payments', description: 'Allocate receipts to specific invoices' },
  { code: 'payments.refund', name: 'Issue Refunds', resource: 'payments', action: 'refund', module: 'Payments', description: 'Process customer excess payment refunds' },
  { code: 'payments.reverse', name: 'Reverse Payments', resource: 'payments', action: 'reverse', module: 'Payments', description: 'Reverse dishonored or erroneous payments' },

  // Products & Inventory
  { code: 'inventory.view', name: 'View Inventory', resource: 'inventory', action: 'view', module: 'Inventory', description: 'View solar modules, inverters & balance of system' },
  { code: 'inventory.create', name: 'Create Product SKU', resource: 'inventory', action: 'create', module: 'Inventory', description: 'Add new equipment catalog SKU' },
  { code: 'inventory.adjust', name: 'Adjust Stock', resource: 'inventory', action: 'adjust', module: 'Inventory', description: 'Record warehouse physical stock adjustments' },
  { code: 'inventory.transfer', name: 'Transfer Stock', resource: 'inventory', action: 'transfer', module: 'Inventory', description: 'Transfer stock between warehouses and hubs' },
  { code: 'inventory.dispatch', name: 'Dispatch Materials', resource: 'inventory', action: 'dispatch', module: 'Inventory', description: 'Issue delivery challans for project sites' },
  { code: 'inventory.reserve', name: 'Reserve Inventory', resource: 'inventory', action: 'reserve', module: 'Inventory', description: 'Reserve solar equipment for confirmed projects' },
  { code: 'inventory.view_cost', name: 'View Purchase Costs', resource: 'inventory', action: 'view_cost', module: 'Inventory', description: 'View supplier landed purchase costs' },

  // Purchases & Suppliers
  { code: 'purchases.view', name: 'View Purchases', resource: 'purchases', action: 'view', module: 'Purchases', description: 'View purchase orders and vendor profiles' },
  { code: 'purchases.create', name: 'Create Purchase Orders', resource: 'purchases', action: 'create', module: 'Purchases', description: 'Draft equipment procurement POs' },
  { code: 'purchases.approve', name: 'Approve Purchase Orders', resource: 'purchases', action: 'approve', module: 'Purchases', description: 'Approve vendor POs and disbursements' },

  // Solar Installation Projects
  { code: 'projects.view', name: 'View Projects', resource: 'projects', action: 'view', module: 'Projects', description: 'Inspect site feasibility and installation progress' },
  { code: 'projects.create', name: 'Create Projects', resource: 'projects', action: 'create', module: 'Projects', description: 'Initiate new solar rooftop project' },
  { code: 'projects.update', name: 'Update Progress', resource: 'projects', action: 'update', module: 'Projects', description: 'Update milestones, structure fixing & wiring' },
  { code: 'projects.assign', name: 'Assign Engineers', resource: 'projects', action: 'assign', module: 'Projects', description: 'Assign project engineers & technicians' },
  { code: 'projects.complete', name: 'Sign-off Commissioning', resource: 'projects', action: 'complete', module: 'Projects', description: 'Commission and sign off grid-connected system' },

  // Subsidy & Net Metering
  { code: 'subsidy.view', name: 'View Subsidy & Net Metering', resource: 'subsidy', action: 'view', module: 'Subsidy', description: 'View PM Surya Ghar claim & DISCOM status' },
  { code: 'subsidy.update', name: 'Update Subsidy Claims', resource: 'subsidy', action: 'update', module: 'Subsidy', description: 'Update portal filing, meter installation & release' },

  // Accounting & Expenses
  { code: 'accounting.view', name: 'View General Ledger', resource: 'accounting', action: 'view', module: 'Accounting', description: 'View Chart of Accounts & expenses' },
  { code: 'accounting.post', name: 'Post Journal Entries', resource: 'accounting', action: 'post', module: 'Accounting', description: 'Create and post balanced journal vouchers' },
  { code: 'accounting.reverse', name: 'Reverse Journal Entries', resource: 'accounting', action: 'reverse', module: 'Accounting', description: 'Reverse incorrect journal postings' },
  { code: 'accounting.close_period', name: 'Close Financial Period', resource: 'accounting', action: 'close_period', module: 'Accounting', description: 'Lock financial years and periods' },

  // Reports & Analytics
  { code: 'reports.view', name: 'View Executive Reports', resource: 'reports', action: 'view', module: 'Reports', description: 'View financial statements & generation analytics' },
  { code: 'reports.export', name: 'Export Reports', resource: 'reports', action: 'export', module: 'Reports', description: 'Download executive reports to Excel/PDF' },

  // Employees & User Management
  { code: 'employees.view', name: 'View Employees', resource: 'employees', action: 'view', module: 'Employees', description: 'View employee directory & team rosters' },
  { code: 'employees.create', name: 'Create Employee Accounts', resource: 'employees', action: 'create', module: 'Employees', description: 'Provision new staff accounts' },
  { code: 'employees.update', name: 'Update Employee Accounts', resource: 'employees', action: 'update', module: 'Employees', description: 'Edit profiles, branches & credentials' },
  { code: 'employees.deactivate', name: 'Deactivate Accounts', resource: 'employees', action: 'deactivate', module: 'Employees', description: 'Suspend or deactivate employee accounts' },

  // System Administration
  { code: 'roles.manage', name: 'Manage Roles', resource: 'roles', action: 'manage', module: 'Settings', description: 'Create and configure custom roles & permissions' },
  { code: 'permissions.manage', name: 'Manage Permissions', resource: 'permissions', action: 'manage', module: 'Settings', description: 'Inspect and configure permission matrices' },
  { code: 'settings.manage', name: 'Manage Company Settings', resource: 'settings', action: 'manage', module: 'Settings', description: 'Configure branches, GST rates & company profile' },
  { code: 'audit_logs.view', name: 'View Audit Logs', resource: 'audit_logs', action: 'view', module: 'Settings', description: 'Inspect security audit trails and user activities' },

  // Solar Maintenance & Services
  { code: 'services.view', name: 'View Service Tickets', resource: 'services', action: 'view', module: 'Service', description: 'View service tickets, AMC & panel cleaning' },
  { code: 'services.create', name: 'Create Service Ticket', resource: 'services', action: 'create', module: 'Service', description: 'Create fault or maintenance tickets' },
  { code: 'services.update', name: 'Update Service Tickets', resource: 'services', action: 'update', module: 'Service', description: 'Update technician visit logs & resolutions' },
  { code: 'services.approve', name: 'Close Service Tickets', resource: 'services', action: 'approve', module: 'Service', description: 'Close and sign off service tickets' },
];

export const ROLES: Record<string, RoleDefinition> = {
  super_admin: {
    name: 'Super Admin',
    slug: 'super_admin',
    description: 'Complete enterprise root administrator with unrestricted access',
    defaultPath: '/dashboard',
    permissions: ['*'],
  },
  accountant: {
    name: 'Accountant',
    slug: 'accountant',
    description: 'Financial controller for billing, tax invoices, customer payments, supplier vouchers & expense audits',
    defaultPath: '/invoices',
    permissions: [
      'dashboard.view',
      'customers.view',
      'quotations.view',
      'invoices.view', 'invoices.create', 'invoices.update_draft', 'invoices.finalize', 'invoices.cancel', 'invoices.export',
      'payments.view', 'payments.create', 'payments.allocate', 'payments.refund', 'payments.reverse',
      'accounting.view', 'accounting.post', 'accounting.reverse',
      'purchases.view', 'purchases.approve',
      'inventory.view', 'inventory.view_cost',
      'subsidy.view', 'subsidy.update',
      'reports.view', 'reports.export',
    ],
  },
  sales_executive: {
    name: 'Sales Executive',
    slug: 'sales_executive',
    description: 'Commercial officer for lead generation, customer on-boarding, rooftop solar quotes & packages',
    defaultPath: '/quotations',
    permissions: [
      'dashboard.view',
      'customers.view', 'customers.create', 'customers.update', 'customers.export',
      'leads.view', 'leads.create', 'leads.assign', 'leads.convert',
      'quotations.view', 'quotations.create', 'quotations.update', 'quotations.convert',
      'projects.view',
      'inventory.view',
      'invoices.view',
    ],
  },
  storekeeper: {
    name: 'Storekeeper',
    slug: 'storekeeper',
    description: 'Warehouse and inventory manager for solar PV modules, inverters, cables, and stock adjustments',
    defaultPath: '/products',
    permissions: [
      'dashboard.view',
      'inventory.view', 'inventory.create', 'inventory.adjust', 'inventory.transfer', 'inventory.dispatch', 'inventory.reserve',
      'purchases.view', 'purchases.create',
      'projects.view',
      'invoices.view',
    ],
  },
  installation_engineer: {
    name: 'Installation Engineer',
    slug: 'installation_engineer',
    description: 'Site commissioning engineer for solar structure civil works, wiring, electrical testing & net metering',
    defaultPath: '/projects',
    permissions: [
      'dashboard.view',
      'projects.view', 'projects.update', 'projects.complete',
      'customers.view',
      'inventory.view',
      'services.view', 'services.update',
      'subsidy.view', 'subsidy.update',
    ],
  },
  service_technician: {
    name: 'Service Technician',
    slug: 'service_technician',
    description: 'Field technician for annual maintenance (AMC), panel cleaning, inverter diagnostics & warranty claims',
    defaultPath: '/services',
    permissions: [
      'dashboard.view',
      'services.view', 'services.create', 'services.update',
      'customers.view',
      'projects.view',
      'inventory.view',
    ],
  },
  branch_manager: {
    name: 'Branch Manager',
    slug: 'branch_manager',
    description: 'Regional branch director managing regional projects, customer relations, branch expenses & staff',
    defaultPath: '/dashboard',
    permissions: [
      'dashboard.view',
      'customers.view', 'customers.create', 'customers.update', 'customers.export',
      'leads.view', 'leads.create', 'leads.assign', 'leads.convert',
      'quotations.view', 'quotations.create', 'quotations.update', 'quotations.approve', 'quotations.convert',
      'projects.view', 'projects.create', 'projects.update', 'projects.assign', 'projects.complete',
      'invoices.view', 'invoices.create', 'invoices.finalize', 'invoices.export',
      'payments.view', 'payments.create', 'payments.allocate',
      'inventory.view', 'inventory.dispatch', 'inventory.reserve',
      'purchases.view', 'purchases.approve',
      'accounting.view', 'accounting.post',
      'services.view', 'services.update', 'services.approve',
      'subsidy.view', 'subsidy.update',
      'reports.view', 'reports.export',
      'employees.view',
    ],
  },
};

/**
 * Standardize permission code to match both dot (invoices.create) and colon (invoices:create) notations
 */
export function normalizePermissionCode(code: string): string {
  return code ? code.trim().toLowerCase().replace(/:/g, '.') : '';
}

/**
 * Check if user permissions grant the required permission (deny-by-default)
 */
export function hasPermission(userPermissions: string[] | undefined | null, permissionCode: string): boolean {
  if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
    return false; // Strict Deny-by-default
  }

  // Super Admin wildcard
  if (userPermissions.includes('*')) {
    return true;
  }

  const target = normalizePermissionCode(permissionCode);
  return userPermissions.some((perm) => {
    if (perm === '*') return true;
    const normalized = normalizePermissionCode(perm);
    if (normalized === target) return true;
    // Resource-level wildcard match (e.g. 'invoices.*')
    if (normalized.endsWith('.*')) {
      const resourcePrefix = normalized.slice(0, -2);
      if (target.startsWith(resourcePrefix + '.')) return true;
    }
    return false;
  });
}

/**
 * Check if user has any of the listed permissions
 */
export function hasAnyPermission(userPermissions: string[] | undefined | null, permissionCodes: string[]): boolean {
  if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
    return false;
  }
  if (userPermissions.includes('*')) return true;
  return permissionCodes.some((code) => hasPermission(userPermissions, code));
}

/**
 * Check if user has all of the listed permissions
 */
export function hasAllPermissions(userPermissions: string[] | undefined | null, permissionCodes: string[]): boolean {
  if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
    return false;
  }
  if (userPermissions.includes('*')) return true;
  return permissionCodes.every((code) => hasPermission(userPermissions, code));
}

/**
 * Check resource and action match
 */
export function checkResourceAction(
  userPermissions: string[] | undefined | null,
  resource: string,
  action: string
): boolean {
  return hasPermission(userPermissions, `${resource}.${action}`);
}
