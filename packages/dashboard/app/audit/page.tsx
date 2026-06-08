"use client";

import { useEffect, useState } from "react";
import { FileText, HardDrive, FileClock, ShieldAlert } from "lucide-react";

export default function AuditPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proxy/logs/status')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-slate-400">Loading log status...</div>;
  }

  if (!data || data.error) {
    return <div className="p-10 text-red-400">Failed to load log status.</div>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Audit Trails</h1>
        <p className="text-slate-400">Overview of persisted request audit logs and error sets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <HardDrive className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Disk Storage (Pino-Roll)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Files Kept</span>
              <span className="font-mono text-white text-lg">{data.fileCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Size</span>
              <span className="font-mono text-white text-lg">{data.totalSizeMb} MB</span>
            </div>
            {data.oldestFile && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Oldest Log</span>
                <span className="font-mono text-white">{new Date(data.oldestFile).toLocaleDateString()}</span>
              </div>
            )}
            {data.newestFile && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Newest Log</span>
                <span className="font-mono text-white">{new Date(data.newestFile).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Redis Buffer (ZSET)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Audit Events Buffered</span>
              <span className="font-mono text-white text-lg">{data.redisAuditCount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Errors Buffered</span>
              <span className="font-mono text-amber-400 text-lg">{data.redisErrorCount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
