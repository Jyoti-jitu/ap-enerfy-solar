import { db, schema } from "../db/index";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding missing modules...");

  const [company] = await db.select().from(schema.companies).limit(1);
  const [branch] = await db.select().from(schema.branches).limit(1);
  const customers = await db.select().from(schema.customers).limit(5);
  const projects = await db.select().from(schema.projects).limit(5);
  const users = await db.select().from(schema.users).limit(3);

  const companyId = company?.id;
  const branchId = branch?.id;

  // 1. Solar Packages
  const existingPkgs = await db.select().from(schema.solarPackages);
  if (existingPkgs.length === 0) {
    console.log("Inserting solar packages...");
    await db.insert(schema.solarPackages).values([
      {
        companyId,
        name: "3 kW PM Surya Ghar Rooftop Solar",
        code: "PKG-ROOF-3KW",
        systemType: "On-Grid",
        capacityKw: "3.00",
        estimatedGenerationKwhPerDay: "12.50",
        estimatedAnnualSavings: "38500.00",
        subsidyApplicable: true,
        estimatedSubsidyAmount: "78000.00",
        basePrice: "165000.00",
        defaultGstRate: "5.00",
        totalPrice: "173250.00",
        description: "Ideal for 2-3 BHK homes. Includes 6x 540W Mono PERC Bi-facial panels, 3.3kW On-Grid inverter, and net meter assistance.",
        isActive: true,
      },
      {
        companyId,
        name: "5 kW Residential Premium Rooftop",
        code: "PKG-ROOF-5KW",
        systemType: "On-Grid",
        capacityKw: "5.00",
        estimatedGenerationKwhPerDay: "21.00",
        estimatedAnnualSavings: "65000.00",
        subsidyApplicable: true,
        estimatedSubsidyAmount: "78000.00",
        basePrice: "245000.00",
        defaultGstRate: "5.00",
        totalPrice: "257250.00",
        description: "Optimal for villas and large homes with AC loads. Includes 10x 540W Tier-1 panels, 5kW dual-MPPT smart inverter.",
        isActive: true,
      },
      {
        companyId,
        name: "10 kW Commercial High-Yield Solar",
        code: "PKG-COMM-10KW",
        systemType: "On-Grid",
        capacityKw: "10.00",
        estimatedGenerationKwhPerDay: "42.00",
        estimatedAnnualSavings: "135000.00",
        subsidyApplicable: false,
        estimatedSubsidyAmount: "0.00",
        basePrice: "480000.00",
        defaultGstRate: "5.00",
        totalPrice: "504000.00",
        description: "Engineered for schools, clinics, and commercial establishments. 3-phase high-efficiency commercial string inverter.",
        isActive: true,
      },
      {
        companyId,
        name: "5 kW Hybrid Solar with LiFePO4 Backup",
        code: "PKG-HYB-5KW",
        systemType: "Hybrid",
        capacityKw: "5.00",
        estimatedGenerationKwhPerDay: "20.50",
        estimatedAnnualSavings: "62000.00",
        subsidyApplicable: true,
        estimatedSubsidyAmount: "78000.00",
        basePrice: "340000.00",
        defaultGstRate: "12.00",
        totalPrice: "380800.00",
        description: "Zero power cut solution. Includes 5kW Hybrid Inverter and 5.12 kWh Lithium Ferro Phosphate (LiFePO4) battery bank.",
        isActive: true,
      },
      {
        companyId,
        name: "8 kW Ground Mounted Agro-Solar",
        code: "PKG-AGRO-8KW",
        systemType: "On-Grid",
        capacityKw: "8.00",
        estimatedGenerationKwhPerDay: "34.00",
        estimatedAnnualSavings: "105000.00",
        subsidyApplicable: false,
        estimatedSubsidyAmount: "0.00",
        basePrice: "395000.00",
        defaultGstRate: "5.00",
        totalPrice: "414750.00",
        description: "Ground mount HDG structure for rural farms, poultry setups, and agro-industries in Odisha.",
        isActive: true,
      },
    ]);
  }

  // 2. Sales Orders
  const existingOrders = await db.select().from(schema.salesOrders);
  if (existingOrders.length === 0 && customers.length > 0) {
    console.log("Inserting sales orders...");
    await db.insert(schema.salesOrders).values([
      {
        orderNumber: "SO-2025-0018",
        companyId,
        branchId,
        customerId: customers[0].id,
        orderDate: new Date("2025-01-20"),
        status: "In Progress",
        totalAmount: "173250.00",
        advanceRequired: "50000.00",
        advanceReceived: "50000.00",
        notes: "3kW Residential On-grid installation for Rajesh Patil in Patia, Bhubaneswar.",
      },
      {
        orderNumber: "SO-2025-0019",
        companyId,
        branchId,
        customerId: customers[1]?.id || customers[0].id,
        orderDate: new Date("2025-01-22"),
        status: "Confirmed",
        totalAmount: "257250.00",
        advanceRequired: "75000.00",
        advanceReceived: "75000.00",
        notes: "5kW Residential On-grid installation for Mehta Residence in CDA Sector 9, Cuttack.",
      },
      {
        orderNumber: "SO-2025-0020",
        companyId,
        branchId,
        customerId: customers[2]?.id || customers[0].id,
        orderDate: new Date("2025-01-24"),
        status: "In Progress",
        totalAmount: "504000.00",
        advanceRequired: "150000.00",
        advanceReceived: "150000.00",
        notes: "10kW Commercial Solar for Patel Industries in Mancheswar Industrial Estate.",
      },
      {
        orderNumber: "SO-2025-0021",
        companyId,
        branchId,
        customerId: customers[3]?.id || customers[0].id,
        orderDate: new Date("2025-01-26"),
        status: "Fulfilled",
        totalAmount: "414750.00",
        advanceRequired: "125000.00",
        advanceReceived: "414750.00",
        notes: "8kW Agro-solar ground installation for Greenfield Farm in Khordha.",
      },
    ]);
  }

  // 3. Warranties
  const existingWarranties = await db.select().from(schema.warranties);
  if (existingWarranties.length === 0 && customers.length > 0) {
    console.log("Inserting warranties...");
    await db.insert(schema.warranties).values([
      {
        warrantyCertificateNo: "WAR-2025-0101",
        companyId,
        customerId: customers[0].id,
        projectId: projects[0]?.id,
        itemType: "Solar Modules",
        brand: "Waaree Energies",
        serialNumber: "WAA-540M-2025-90812",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2050-01-15"),
        durationYears: 25,
        status: "Active",
      },
      {
        warrantyCertificateNo: "WAR-2025-0102",
        companyId,
        customerId: customers[0].id,
        projectId: projects[0]?.id,
        itemType: "Solar Inverter",
        brand: "Growatt",
        serialNumber: "GRO-MIN-3300-4412",
        startDate: new Date("2025-01-15"),
        endDate: new Date("2032-01-15"),
        durationYears: 7,
        status: "Active",
      },
      {
        warrantyCertificateNo: "WAR-2025-0103",
        companyId,
        customerId: customers[1]?.id || customers[0].id,
        projectId: projects[1]?.id,
        itemType: "Solar Modules",
        brand: "Adani Solar",
        serialNumber: "ADN-545M-2025-10294",
        startDate: new Date("2025-01-20"),
        endDate: new Date("2050-01-20"),
        durationYears: 25,
        status: "Active",
      },
      {
        warrantyCertificateNo: "WAR-2025-0104",
        companyId,
        customerId: customers[2]?.id || customers[0].id,
        projectId: projects[2]?.id,
        itemType: "Solar Inverter",
        brand: "Sungrow",
        serialNumber: "SNG-SG10RT-8841",
        startDate: new Date("2025-01-22"),
        endDate: new Date("2035-01-22"),
        durationYears: 10,
        status: "Active",
      },
    ]);
  }

  // 4. AMC Contracts
  const existingAmc = await db.select().from(schema.amcContracts);
  if (existingAmc.length === 0 && customers.length > 0) {
    console.log("Inserting AMC contracts...");
    await db.insert(schema.amcContracts).values([
      {
        contractNumber: "AMC-2025-0012",
        companyId,
        customerId: customers[0].id,
        projectId: projects[0]?.id,
        planName: "Comprehensive Solar AMC (Quarterly Cleaning + Electrical Audit)",
        annualVisits: 4,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2026-02-01"),
        contractValue: "7500.00",
        status: "Active",
      },
      {
        contractNumber: "AMC-2025-0013",
        companyId,
        customerId: customers[2]?.id || customers[0].id,
        projectId: projects[2]?.id,
        planName: "Industrial Commercial AMC (Monthly Monitoring + IV Curve Tracing)",
        annualVisits: 12,
        startDate: new Date("2025-02-01"),
        endDate: new Date("2027-02-01"),
        contractValue: "28000.00",
        status: "Active",
      },
    ]);
  }

  // 5. Notifications
  const existingNotifs = await db.select().from(schema.notifications);
  if (existingNotifs.length === 0 && users.length > 0) {
    console.log("Inserting notifications...");
    const targetUserId = users[0].id;
    await db.insert(schema.notifications).values([
      {
        userId: targetUserId,
        title: "PM Surya Ghar Subsidy Sanctioned",
        message: "Subsidy of ₹78,000 for customer Rajesh Patil (App #OD-2025-0891) has been approved by TPCODL.",
        type: "PROJECT",
        link: "/projects",
        isRead: false,
      },
      {
        userId: targetUserId,
        title: "Payment Received: ₹1,50,000",
        message: "Advance payment of ₹1,50,000 received for Patel Industries (INV-2025-0141) via NEFT.",
        type: "PAYMENT",
        link: "/payments",
        isRead: false,
      },
      {
        userId: targetUserId,
        title: "Net Meter Test Report Generated",
        message: "TPCODL Discom inspector approved bi-directional net meter for Mehta Residence site.",
        type: "PROJECT",
        link: "/projects",
        isRead: false,
      },
      {
        userId: targetUserId,
        title: "Low Inventory Alert: 540W Solar Modules",
        message: "Waaree 540W Mono PERC stock in Bhubaneswar Central Depot dropped below safety threshold (14 left).",
        type: "INVENTORY",
        link: "/products",
        isRead: true,
        readAt: new Date(),
      },
      {
        userId: targetUserId,
        title: "New Lead Assigned: Baleswar Hospital 25kW",
        message: "Solar consultation enquiry submitted via website for Dr. Mohapatra Clinic, Baleswar.",
        type: "LEAD",
        link: "/leads",
        isRead: true,
        readAt: new Date(),
      },
    ]);
  }

  console.log("Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
