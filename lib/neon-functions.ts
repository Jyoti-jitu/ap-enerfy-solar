/**
 * Neon Functions Client
 * Invokes long-running serverless functions running on the Neon branch compute.
 * Injected env vars: NEON_BRANCH_ID, NEON_FUNCTION_HOST_SUFFIX
 */

export function getNeonFunctionUrl(functionSlug: string = "hello"): string {
  const branchId = process.env.NEON_BRANCH_ID || "br-withered-salad-bi0fdxyu";
  const hostSuffix = process.env.NEON_FUNCTION_HOST_SUFFIX || ".compute.c-5.ap-southeast-1.aws.neon.tech";
  return `https://${branchId}-${functionSlug}${hostSuffix}/`;
}

export function isNeonFunctionsConfigured(): boolean {
  return Boolean(process.env.NEON_FUNCTION_HOST_SUFFIX);
}

export async function invokeNeonFunction(
  functionSlug: string = "hello",
  options: RequestInit = {}
): Promise<{
  status: number;
  ok: boolean;
  url: string;
  data: string;
  headers: Record<string, string>;
}> {
  const url = getNeonFunctionUrl(functionSlug);

  const res = await fetch(url, {
    method: "GET",
    ...options,
  });

  const text = await res.text();
  const headers: Record<string, string> = {};
  res.headers.forEach((val, key) => {
    headers[key] = val;
  });

  return {
    status: res.status,
    ok: res.ok,
    url,
    data: text,
    headers,
  };
}
