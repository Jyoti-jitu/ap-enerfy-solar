import React from "react";
import { getProjects } from "@/services/project.service";
import { ProjectsClient } from "./projects-client";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const systemType = typeof params.systemType === "string" ? params.systemType : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const team = typeof params.team === "string" ? params.team : undefined;

  const data = await getProjects({ search, systemType, status, team });

  return <ProjectsClient initialData={data} />;
}
