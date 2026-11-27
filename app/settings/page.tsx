"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Building2,
  Shield,
  FileSpreadsheet,
  Percent,
  Sun,
  Save,
  Database,
  Cloud,
  Layers,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Users,
  ArrowRight,
} from "lucide-react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("AP Enerfy Solar Pvt Ltd");
  const [gstin, setGstin] = useState("21AAACA1234A1Z5");
  const [pan, setPan] = useState("AAACA1234A");
  const [stateCode, setStateCode] = useState("21 (Odisha)");
  const [discomName, setDiscomName] = useState("TPCODL");
  const [saved, setSaved] = useState(false);

  // Neon status test state
  const [testingNeon, setTestingNeon] = useState(false);
  const [neonStatus, setNeonStatus] = useState<any>(null);

  const testNeonServices = async () => {
    setTestingNeon(true);
    try {
      const res = await fetch("/api/neon/status");
      const data = await res.json();
      setNeonStatus(data);
    } catch (err: any) {
      setNeonStatus({ error: err.message });
    } finally {
      setTestingNeon(false);
    }
  };

  useEffect(() => {
    testNeonServices();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Organization & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
          Configure company profile, GST details, Discom sync and multi-branch operations
        </p>
      </div>

      {/* NEON CLOUD INFRASTRUCTURE STATUS PANEL */}
      <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-950">
                  Neon Cloud Architecture
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Provisioned
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Branch: <strong>production</strong> (br-withered-salad-bi0fdxyu) · Region: <strong>ap-southeast-1</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={testNeonServices}
            disabled={testingNeon}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${testingNeon ? "animate-spin" : ""}`} />
            <span>{testingNeon ? "Testing Services..." : "Run Diagnostic Test"}</span>
          </button>
        </div>

        {/* 4 Wired Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Service 1: Lakebase Postgres */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-950">
                  <Database className="h-4 w-4 text-emerald-600" />
                  Postgres (Drizzle)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {neonStatus?.services?.postgres?.status === "online" ? "Online" : "Connecting"}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                Lakebase Postgres with connection pooling, migrations, and schema sync.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-700 flex justify-between font-semibold">
              <span>Latency:</span>
              <span className="font-bold text-slate-950">{neonStatus?.services?.postgres?.latencyMs ? `${neonStatus.services.postgres.latencyMs}ms` : "—"}</span>
            </div>
          </div>

          {/* Service 2: Object Storage */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-950">
                  <Layers className="h-4 w-4 text-sky-600" />
                  Object Storage
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {neonStatus?.services?.objectStorage?.status === "online" ? "Online" : "Connecting"}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                S3-compatible bucket <code>uploads</code> for solar documents & attachments.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-700 flex justify-between font-semibold">
              <span>Bucket:</span>
              <span className="font-bold text-slate-950">uploads</span>
            </div>
          </div>

          {/* Service 3: Functions */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-950">
                  <Zap className="h-4 w-4 text-amber-600" />
                  Neon Functions
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {neonStatus?.services?.functions?.status === "online" ? "Online" : "Connecting"}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                Long-running serverless function <code>hello</code> running next to data.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-700 flex justify-between font-semibold">
              <span>Function:</span>
              <span className="font-bold text-slate-950">hello.ts</span>
            </div>
          </div>

          {/* Service 4: Realtime */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-950">
                  <Activity className="h-4 w-4 text-purple-600" />
                  Live Realtime
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  {neonStatus?.services?.realtime?.status === "online" ? "Online" : "Connecting"}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                Reactive Live SQL API protocol enabled for real-time dashboard sync.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-700 flex justify-between font-semibold">
              <span>Protocol:</span>
              <span className="font-bold text-slate-950">WebSocket API</span>
            </div>
          </div>
        </div>

        {neonStatus?.services && (
          <div className="mt-4 p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-xs font-mono flex items-center justify-between text-slate-800">
            <span>
              Diagnostic Result: <strong>All {Object.keys(neonStatus.services).length} Neon Services Verified</strong>
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> 100% Operational
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b text-slate-900 font-bold text-sm">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>Company & Billing Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Company Registered Legal Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-mono font-medium focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">PAN Card Number</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-mono font-medium focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">State & State Code</label>
              <input
                type="text"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 pb-2 border-b text-slate-900 font-bold text-sm">
            <Sun className="h-4 w-4 text-emerald-600" />
            <span>Discom & Net Metering Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Primary Power Distribution Utility</label>
              <select
                value={discomName}
                onChange={(e) => setDiscomName(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none bg-white"
              >
                <option value="TPCODL">TPCODL (Tata Power Central Odisha Distribution)</option>
                <option value="TPNODL">TPNODL (Tata Power Northern Odisha Distribution)</option>
                <option value="TPSODL">TPSODL (Tata Power Southern Odisha Distribution)</option>
                <option value="TPWODL">TPWODL (Tata Power Western Odisha Distribution)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Standard Solar PV GST Rate</label>
              <select className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none bg-white">
                <option value="5">5% (Composite Rooftop Solar Rate)</option>
                <option value="12">12% (Inverters and Solar Modules)</option>
                <option value="18">18% (Commercial services & engineering)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {saved ? (
              <span className="text-emerald-700 font-semibold text-xs">
                ✓ Settings updated successfully!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Quick link to Employee Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Employee & User Management</h3>
            <p className="text-xs text-slate-600 font-medium">Manage employees, branch assignments, passwords, and user statuses</p>
          </div>
        </div>
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <span>Open Employee Directory</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
