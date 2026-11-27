"use client";

import React from "react";
import { HelpCircle, Phone, Mail, FileCode2, ExternalLink, ShieldCheck, Sun } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export function HelpModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sun className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <Dialog.Title className="text-base font-bold text-slate-900">
                AP Enerfy Solar Support & Guide
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500">
                Billing & Operations Assistance Console
              </Dialog.Description>
            </div>
          </div>

          <div className="space-y-4 py-4 text-xs text-slate-600">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="font-semibold text-emerald-900">Hotline & Operations Desk</p>
              <div className="mt-2 space-y-1 text-emerald-800">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 94370 11456 / +91 99370 22456</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@apenerfy.com</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-slate-800">Keyboard Shortcuts</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span>Global Search</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">⌘K</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span>Toggle Sidebar</span>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">⌘B</kbd>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Headquarters: Plot No. 124, Saheed Nagar, Bhubaneswar, Odisha 751007</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
            >
              Close Guide
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
