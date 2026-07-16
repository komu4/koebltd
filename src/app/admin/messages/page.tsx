"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Download } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const load = () => fetch("/api/contact").then((r) => r.json()).then(setMessages);

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    load();
  };

  const toggleRead = async (m: Message) => {
    await fetch(`/api/contact/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    load();
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Subject", "Message", "Received"];
    const rows = messages.map((m) => [m.name, m.email, m.phone || "", m.subject || "", m.message.replace(/\n/g, " "), m.createdAt]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "koeb-messages.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Messages</h1>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 rounded-button border border-brand-border px-4 py-2.5 text-sm font-heading font-semibold"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <p className="rounded-card bg-white p-6 text-sm text-brand-text/60 shadow-sm">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`rounded-card bg-white p-5 shadow-sm ${!m.read ? "border-l-4 border-brand-red" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="break-words font-heading font-semibold">{m.name} <span className="font-normal text-brand-text/50">— {m.email}</span></p>
                {m.subject && <p className="text-sm text-brand-text/60">{m.subject}</p>}
                <p className="mt-2 text-sm text-brand-text/80">{m.message}</p>
                <p className="mt-2 text-xs text-brand-text/40">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => toggleRead(m)} className="text-brand-text/60 hover:text-brand-red">
                  {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button onClick={() => remove(m.id)} className="text-brand-text/60 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
