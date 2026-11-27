import { NextResponse } from "next/server";
import { checkNeonDatabase } from "@/db";
import {
  isNeonStorageConfigured,
  uploadObject,
  getObject,
  getPresignedUrl,
  deleteObject,
  listObjects,
} from "@/lib/neon-storage";
import {
  isNeonFunctionsConfigured,
  getNeonFunctionUrl,
  invokeNeonFunction,
} from "@/lib/neon-functions";
import {
  isNeonRealtimeConfigured,
  sealLiveQuery,
} from "@/lib/neon-realtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    branch: process.env.NEON_BRANCH || "production",
    branchId: process.env.NEON_BRANCH_ID || "br-withered-salad-bi0fdxyu",
    services: {},
  };

  // 1. TEST NEON POSTGRESQL
  const pgStart = Date.now();
  try {
    const dbStatus = await checkNeonDatabase();
    results.services.postgres = {
      status: "online",
      latencyMs: Date.now() - pgStart,
      details: {
        isNeon: dbStatus.isNeon,
        database: dbStatus.database,
        version: dbStatus.version.split(" on ")[0],
        counts: {
          customers: dbStatus.customerCount,
          invoices: dbStatus.invoiceCount,
          projects: dbStatus.projectCount,
        },
      },
    };
  } catch (err: any) {
    results.services.postgres = {
      status: "error",
      latencyMs: Date.now() - pgStart,
      error: err.message,
    };
  }

  // 2. TEST NEON OBJECT STORAGE
  const storageStart = Date.now();
  if (!isNeonStorageConfigured()) {
    results.services.objectStorage = {
      status: "not_configured",
      latencyMs: 0,
      message: "AWS_* S3 credentials not found in environment",
    };
  } else {
    try {
      const testKey = `diagnostics/ping-${Date.now()}.json`;
      const testPayload = JSON.stringify({
        system: "AP Enerfy Solar ERP",
        status: "active",
        timestamp: new Date().toISOString(),
      });

      // Upload
      await uploadObject({
        key: testKey,
        body: testPayload,
        contentType: "application/json",
      });

      // Read back
      const readResult = await getObject({ key: testKey });

      // Presign
      const presignedUrl = await getPresignedUrl({ key: testKey, expiresIn: 300 });

      // Clean up test object
      await deleteObject({ key: testKey });

      results.services.objectStorage = {
        status: "online",
        latencyMs: Date.now() - storageStart,
        details: {
          bucket: "uploads",
          region: process.env.AWS_REGION || "ap-southeast-1",
          endpoint: process.env.AWS_ENDPOINT_URL_S3,
          readWriteVerified: readResult.text.includes("AP Enerfy Solar ERP"),
          presignedUrlGenerated: Boolean(presignedUrl && presignedUrl.includes("http")),
        },
      };
    } catch (err: any) {
      results.services.objectStorage = {
        status: "error",
        latencyMs: Date.now() - storageStart,
        error: err.message,
      };
    }
  }

  // 3. TEST NEON FUNCTIONS
  const fnStart = Date.now();
  try {
    const fnUrl = getNeonFunctionUrl("hello");
    const fnResponse = await invokeNeonFunction("hello");

    results.services.functions = {
      status: fnResponse.ok ? "online" : "degraded",
      latencyMs: Date.now() - fnStart,
      details: {
        function: "hello",
        url: fnUrl,
        statusCode: fnResponse.status,
        response: fnResponse.data.trim(),
      },
    };
  } catch (err: any) {
    results.services.functions = {
      status: "error",
      latencyMs: Date.now() - fnStart,
      error: err.message,
      details: {
        url: getNeonFunctionUrl("hello"),
      },
    };
  }

  // 4. TEST NEON REALTIME
  const rtStart = Date.now();
  if (!isNeonRealtimeConfigured()) {
    results.services.realtime = {
      status: "not_configured",
      latencyMs: 0,
      message: "NEON_REALTIME_SECRET or NEON_REALTIME_URL not found in environment",
    };
  } else {
    try {
      // Seal a query for live execution
      const sealed = await sealLiveQuery("SELECT count(*) as customer_count FROM customers");

      results.services.realtime = {
        status: "online",
        latencyMs: Date.now() - rtStart,
        details: {
          endpoint: process.env.NEON_REALTIME_URL,
          sealedQueryType: typeof sealed,
          isSealed: Boolean(sealed),
        },
      };
    } catch (err: any) {
      results.services.realtime = {
        status: "error",
        latencyMs: Date.now() - rtStart,
        error: err.message,
      };
    }
  }

  const allOnline = Object.values(results.services).every(
    (s: any) => s.status === "online"
  );

  return NextResponse.json({
    ok: allOnline,
    ...results,
  });
}
