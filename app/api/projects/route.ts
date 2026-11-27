import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/services/project.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const systemType = searchParams.get("systemType") || undefined;
    const status = searchParams.get("status") || undefined;
    const team = searchParams.get("team") || undefined;

    const data = await getProjects({ search, systemType, status, team });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customerId || !body.capacity) {
      return NextResponse.json({ error: "Customer and Capacity are required" }, { status: 400 });
    }

    const project = await createProject({
      ...body,
      startDate: new Date(body.startDate || Date.now()),
      targetEndDate: new Date(body.targetEndDate || Date.now() + 20 * 86400000),
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
