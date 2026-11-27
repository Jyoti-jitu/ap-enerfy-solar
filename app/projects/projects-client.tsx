"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { SYSTEM_TYPES } from "@/lib/constants";
import {
  Plus,
  LayoutGrid,
  Download,
  Calendar,
  Search,
  Eye,
  Pencil,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  Kanban,
  MapPin,
  Clock,
  HardHat,
} from "lucide-react";
import { CreateProjectModal } from "@/components/shared/modals/create-project-modal";

export function ProjectsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<"list" | "kanban" | "timeline" | "map">("list");
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const filtered = data.projects.filter((p: any) => {
    if (search && !p.projectId.toLowerCase().includes(search.toLowerCase()) && !p.customer?.name.toLowerCase().includes(search.toLowerCase()) && !p.location.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedSystem !== "All Types" && p.systemType !== selectedSystem) {
      return false;
    }
    if (selectedStatus !== "All Status" && p.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const getProgressBarColor = (status: string, progress: number) => {
    if (progress === 100 || status === "Completed") return "bg-emerald-600";
    if (status === "In Progress") return "bg-blue-600";
    if (status === "Installation") return "bg-amber-500";
    if (status === "Material Dispatch") return "bg-purple-600";
    if (status === "Survey Done") return "bg-sky-500";
    return "bg-slate-300";
  };

  const kanbanColumns = [
    { title: "Survey Done", status: "Survey Done" },
    { title: "Material Dispatch", status: "Material Dispatch" },
    { title: "Installation / In Progress", status: "Installation" },
    { title: "Completed & Synced", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Projects / Installations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track solar installations from survey to commissioning
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === "kanban" ? "list" : "kanban")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
            <span>{activeTab === "kanban" ? "Table View" : "Kanban View"}</span>
          </button>

          <a
            href="/api/export/customers"
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy 3.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title="Total Projects"
          value={data.kpis.totalProjects}
          change="+14 this month"
          isPositive={true}
          theme="green"
          iconName="hardhat"
        />
        <KPICard
          title="In Progress"
          value={data.kpis.inProgress}
          theme="blue"
          iconName="wrench"
        />
        <KPICard
          title="Completed"
          value={data.kpis.completed}
          subtext="(48.8%)"
          subtextColor="emerald"
          theme="yellow"
          iconName="checkcircle"
        />
        <KPICard
          title="Upcoming"
          value={data.kpis.upcoming}
          theme="purple"
          iconName="calendar"
        />
        <KPICard
          title="Delayed"
          value={data.kpis.delayed}
          theme="rose"
          iconName="clock"
        />
      </div>

      {/* Sub Tabs (Matches image copy 3.png) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "list"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <List className="h-4 w-4" />
          <span>Project List</span>
        </button>

        <button
          onClick={() => setActiveTab("kanban")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "kanban"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <Kanban className="h-4 w-4" />
          <span>Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "timeline"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Timeline (Gantt)</span>
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "map"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Map View</span>
        </button>
      </div>

      {activeTab === "list" && (
        <>
          {/* Filter Bar (Matches image copy 3.png) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by project ID, customer or location..."
                  className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  System Type
                </label>
                <select
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Types">All Types</option>
                  {SYSTEM_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Status">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Installation">Installation</option>
                  <option value="Material Dispatch">Material Dispatch</option>
                  <option value="Completed">Completed</option>
                  <option value="Survey Done">Survey Done</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Teams">All Teams</option>
                  <option value="Team Alpha">Team Alpha</option>
                  <option value="Team Bravo">Team Bravo</option>
                  <option value="Team Delta">Team Delta</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-center justify-end">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg mt-3.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Jan 1 – Jan 31</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Table (Matches image copy 3.png) */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="py-3 px-3 w-10 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    </th>
                    <th className="py-3 px-3">Project ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Capacity</th>
                    <th className="py-3 px-3">System Type</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">Target End</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 w-36">Progress</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prj: any) => (
                    <tr
                      key={prj.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedProject(prj)}
                    >
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {prj.projectId}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {prj.customer?.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{prj.location}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {prj.capacity} kW
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={prj.systemType} type="system" />
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(prj.startDate)}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(prj.targetEndDate)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={prj.status} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressBarColor(
                                prj.status,
                                prj.progress
                              )}`}
                              style={{ width: `${prj.progress}%` }}
                            />
                          </div>
                          <span className="font-semibold text-[11px] text-slate-700 min-w-8 text-right">
                            {prj.progress}%
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                          <button
                            onClick={() => setSelectedProject(prj)}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>
                Showing 1-{Math.min(filtered.length, 8)} of {data.totalCount} projects
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="h-7 w-7 rounded-lg bg-emerald-700 text-white font-semibold shadow-sm">
                  1
                </button>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  2
                </button>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
                  11
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                  <ChevronsRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Kanban Board View */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colProjects = data.projects.filter((p: any) =>
              col.status === "Installation"
                ? ["Installation", "In Progress"].includes(p.status)
                : p.status === col.status
            );

            return (
              <div
                key={col.title}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col min-h-96"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
                  <span className="text-xs font-bold text-slate-800">
                    {col.title}
                  </span>
                  <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colProjects.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-700">
                          {p.projectId}
                        </span>
                        <StatusBadge status={p.systemType} type="system" />
                      </div>
                      <h4 className="mt-1 font-semibold text-xs text-slate-900">
                        {p.customer?.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {p.location} · {p.capacity} kW
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${getProgressBarColor(p.status, p.progress)}`}
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {p.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gantt & Map Views */}
      {(activeTab === "timeline" || activeTab === "map") && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <MapPin className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">
            {activeTab === "timeline" ? "Project Gantt Schedule" : "Odisha Solar Site GIS Map"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Visualizing active installations across Bhubaneswar, Cuttack, Puri, Khordha, and Jajpur districts with technician routes and net-meter inspections.
          </p>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  {selectedProject.projectId}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedProject.customer?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-semibold text-slate-800">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Capacity</span>
                  <span className="font-semibold text-slate-800">{selectedProject.capacity} kW</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Assigned Team</span>
                  <span className="font-semibold text-slate-800">{selectedProject.assignedTeam}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Status</span>
                  <StatusBadge status={selectedProject.status} />
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Discom App: </span>
                <span>{selectedProject.discomApplicationNumber || "TPC-APP-8841"}</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetch("/api/projects")
            .then((r) => r.json())
            .then((d) => setData(d));
        }}
      />
    </div>
  );
}
